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
          <NuxtLink
            v-else-if="getPhotoRoutePath(photo)"
            class="photo-card-link"
            :to="getPhotoRoutePath(photo)"
            :aria-label="`${photo.alt}. ${photo.route}`"
          >
            <OptimizedImage
              :src="photo.src"
              width="900"
              height="900"
              sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 31vw"
              :widths="[480, 720, 960]"
              :loading="getPhotoLoading(photo)"
              :fetchpriority="getPhotoFetchPriority(photo)"
              :alt="photo.alt"
            />
          </NuxtLink>
          <OptimizedImage
            v-else
            :src="photo.src"
            width="900"
            height="900"
            sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 31vw"
            :widths="[480, 720, 960]"
            :loading="getPhotoLoading(photo)"
            :fetchpriority="getPhotoFetchPriority(photo)"
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

const { assetPath, webpSrcset } = useImageSources()
const { text, tourPhotos, localePath } = useLocaleContent()
const firstImagePhoto = computed(() => tourPhotos.value.find((photo) => photo.kind !== 'video'))

useAnturSeo({
  title: text.value.gallery.seoTitle,
  description: text.value.gallery.seoDescription,
  path: '/gallery'
})

useHead(() => firstImagePhoto.value
  ? {
      link: [
        {
          rel: 'preload',
          as: 'image',
          href: assetPath(`/images/webp/${firstImagePhoto.value.src.split('/').pop()?.replace(/\.[^.]+$/, '')}-720.webp`),
          imagesrcset: webpSrcset(firstImagePhoto.value.src, [480, 720, 960]),
          imagesizes: '(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 31vw',
          type: 'image/webp',
          fetchpriority: 'high'
        }
      ]
    }
  : {})

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

const getPhotoRoutePath = (photo: { routeSlug?: string, route: string }) => {
  const slug = getPhotoRouteSlug(photo)
  return slug ? localePath(`/routes/${slug}`) : undefined
}

const isFirstImagePhoto = (photo: { id: string }) => photo.id === firstImagePhoto.value?.id
const getPhotoLoading = (photo: { id: string }) => isFirstImagePhoto(photo) ? 'eager' : 'lazy'
const getPhotoFetchPriority = (photo: { id: string }) => isFirstImagePhoto(photo) ? 'high' : 'low'
</script>

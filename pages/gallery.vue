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
            :ref="registerVideo"
            controls
            playsinline
            preload="none"
            :data-poster="photo.posterSrc ? assetPath(photo.posterSrc) : undefined"
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
          <p class="visually-hidden">
            <strong>{{ photo.route }}</strong>
            <span>{{ photo.caption || photo.alt }}</span>
            <time :datetime="photo.date">{{ mediaDate(photo.date) }}</time>
          </p>
          <div v-if="getVideoWatchPath(photo.id)" class="photo-card-caption">
            <NuxtLink class="gallery-watch-link" :to="getVideoWatchPath(photo.id)">
              Смотреть отдельную страницу видео
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toVideoPublicationDateTime } from '~/utils/video-date'
import { formatMediaDate } from '~/utils/media-date'
import { videoWatchPageByMediaId } from '~/data/video-pages'

const { assetPath, webpSrcset } = useImageSources()
const { text } = useLocaleContent()
const { tourPhotos } = useSocialProof()
const { routePathBySlug } = useRouteLinks()
const { locale } = useLocaleContent()
const firstImagePhoto = computed(() => tourPhotos.value.find((photo) => photo.kind !== 'video'))

const { url: galleryUrl } = useAnturSeo({
  title: text.value.gallery.seoTitle,
  description: text.value.gallery.seoDescription,
  path: '/gallery'
})
useBusinessSchema()

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string
const absoluteAssetUrl = (path: string) => new URL(assetPath(path), siteUrl).toString()

useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ImageGallery',
      '@id': `${galleryUrl}#gallery`,
      name: text.value.gallery.title,
      description: text.value.gallery.lead,
      url: galleryUrl,
      associatedMedia: tourPhotos.value.map((item) => item.kind === 'video'
        ? {
            '@type': 'VideoObject',
            name: item.alt,
            description: item.caption || item.alt,
            contentUrl: absoluteAssetUrl(item.videoSrc || item.src),
            thumbnailUrl: item.posterSrc ? absoluteAssetUrl(item.posterSrc) : undefined,
            uploadDate: toVideoPublicationDateTime(item.date)
          }
        : {
            '@type': 'ImageObject',
            name: item.alt,
            caption: item.caption || item.alt,
            contentUrl: absoluteAssetUrl(item.src),
            datePublished: item.date
          })
    })
  }]
}))

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
  return slug ? routePathBySlug(slug) : undefined
}

const getVideoWatchPath = (mediaId: string) =>
  locale.value === 'ru' ? videoWatchPageByMediaId.get(mediaId)?.path : undefined

const isFirstImagePhoto = (photo: { id: string }) => photo.id === firstImagePhoto.value?.id
const getPhotoLoading = (photo: { id: string }) => isFirstImagePhoto(photo) ? 'eager' : 'lazy'
const getPhotoFetchPriority = (photo: { id: string }) => isFirstImagePhoto(photo) ? 'high' : 'low'
const mediaDate = (date: string) => formatMediaDate(date, locale.value)

const videoElements = new Set<HTMLVideoElement>()
let videoObserver: IntersectionObserver | undefined

const registerVideo = (element: unknown) => {
  if (import.meta.client && element instanceof HTMLVideoElement) {
    videoElements.add(element)
  }
}

onMounted(() => {
  const loadVideoPreview = (video: HTMLVideoElement) => {
    if (video.dataset.poster && !video.poster) {
      video.poster = video.dataset.poster
    }
  }

  if (!('IntersectionObserver' in window)) {
    videoElements.forEach(loadVideoPreview)
    return
  }

  videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return
      }

      const video = entry.target as HTMLVideoElement
      loadVideoPreview(video)
      videoObserver?.unobserve(video)
    })
  }, { rootMargin: '240px 0px' })

  videoElements.forEach((video) => videoObserver?.observe(video))
})

onBeforeUnmount(() => {
  videoObserver?.disconnect()
  videoElements.clear()
})
</script>

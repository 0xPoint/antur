<template>
  <article v-if="page && media" class="video-watch-page">
    <section class="section page-top">
      <div class="container video-watch-layout">
        <nav class="route-breadcrumbs" aria-label="Хлебные крошки">
          <NuxtLink to="/">Антур</NuxtLink>
          <NuxtLink to="/gallery/">Галерея</NuxtLink>
          <span>{{ page.title }}</span>
        </nav>
        <p class="eyebrow">Видео с маршрута</p>
        <h1>{{ page.title }}</h1>
        <p class="page-lead">{{ page.description }}</p>
        <video controls playsinline preload="metadata" :poster="assetPath(media.posterSrc || '')" :aria-label="media.alt">
          <source :src="assetPath(media.videoSrc || media.src)" type="video/mp4">
        </video>
        <div class="video-watch-meta">
          <div>
            <span>Дата съемки</span>
            <time :datetime="media.date">{{ formattedDate }}</time>
          </div>
          <div>
            <span>Маршрут</span>
            <NuxtLink :to="page.routePath">{{ page.routeLabel }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="section route-extra-section">
      <div class="container route-extra-grid">
        <article v-for="detail in page.details" :key="detail" class="detail-panel">
          <span>Фактический опыт</span>
          <p>{{ detail }}</p>
        </article>
      </div>
    </section>

    <section class="section booking">
      <div class="container booking-panel video-watch-cta">
        <div class="booking-copy">
          <p class="eyebrow">Выбрать маршрут</p>
          <h2>Хотите увидеть Камчатку с воды?</h2>
          <p>Уточним свободные даты, погоду и формат выхода без обещаний, которые зависят от дикой природы или моря.</p>
          <ContactButton label="Уточнить дату" :context="page.title" />
        </div>
        <NuxtLink class="card-link dark-link" :to="page.routePath">Открыть маршрут</NuxtLink>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { tourPhotos } from '~/data/social-proof'
import { videoWatchPages } from '~/data/video-pages'
import { toVideoPublicationDateTime } from '~/utils/video-date'

const route = useRoute()
const page = videoWatchPages.find((item) => item.slug === String(route.params.slug || ''))

if (!page) {
  throw createError({ statusCode: 404, statusMessage: 'Видео не найдено' })
}

const media = tourPhotos.find((item) => item.id === page.mediaId && item.kind === 'video')

if (!media) {
  throw createError({ statusCode: 404, statusMessage: 'Видео не найдено' })
}

const seo = useAnturSeo({
  title: page.seoTitle,
  description: page.seoDescription,
  path: page.path,
  image: media.posterSrc,
  localized: false
})
useBusinessSchema()

const assetPath = useAssetPath()
const videoUrl = new URL(assetPath(media.videoSrc || media.src), seo.siteUrl).toString()
const posterUrl = new URL(assetPath(media.posterSrc || ''), seo.siteUrl).toString()
const pageUrl = new URL(assetPath(page.path), seo.siteUrl).toString()
const formattedDate = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date(`${media.date}T12:00:00+12:00`))

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      '@id': `${pageUrl}#video`,
      name: page.title,
      description: page.description,
      contentUrl: videoUrl,
      embedUrl: pageUrl,
      thumbnailUrl: posterUrl,
      uploadDate: toVideoPublicationDateTime(media.date),
      datePublished: toVideoPublicationDateTime(media.date),
      inLanguage: 'ru',
      isFamilyFriendly: true,
      publisher: { '@id': `${new URL(assetPath('/'), seo.siteUrl)}#organization` }
    })
  }]
})
</script>

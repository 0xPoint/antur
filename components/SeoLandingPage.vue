<template>
  <article>
    <section class="route-hero seo-landing-hero">
      <OptimizedImage
        :src="page.heroImage"
        width="1600"
        height="900"
        sizes="100vw"
        :widths="[720, 960, 1280, 1600]"
        loading="eager"
        fetchpriority="high"
        :alt="page.heroAlt"
      />
      <div class="route-hero-overlay" />
      <div class="container route-hero-content">
        <nav class="route-breadcrumbs" :aria-label="text.navAria">
          <NuxtLink :to="localePath('/')">{{ businessText.brand }}</NuxtLink>
          <span>{{ page.title }}</span>
        </nav>
        <p class="eyebrow">{{ page.eyebrow }}</p>
        <h1>{{ page.title }}</h1>
        <p>{{ page.description }}</p>
        <div class="hero-actions">
          <ContactButton :label="text.contact.bookTrip" :context="page.ctaContext" />
        </div>
      </div>
    </section>

    <section class="section route-extra-section">
      <div class="container route-extra-grid">
        <div v-for="section in page.sections" :key="section.title" class="detail-panel">
          <span>{{ page.eyebrow }}</span>
          <strong>{{ section.title }}</strong>
          <p>{{ section.text }}</p>
        </div>
      </div>
    </section>

    <section class="section routes">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.home.routesEyebrow }}</p>
          <h2>{{ text.home.routesTitle }}</h2>
        </div>
        <div class="route-grid">
          <RouteCard v-for="offer in pageRoutes" :key="offer.slug" :offer="offer" />
        </div>
      </div>
    </section>

    <section v-if="pagePhotos.length" class="section route-gallery-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.home.galleryEyebrow }}</p>
          <h2>{{ text.route.routePhotos }}</h2>
        </div>
        <div class="gallery-list">
          <article v-for="photo in pagePhotos" :key="photo.id" class="photo-card">
            <OptimizedImage
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

    <section class="section route-faq-section">
      <div class="container faq-grid">
        <div>
          <p class="eyebrow">{{ text.home.faqEyebrow }}</p>
          <h2>{{ text.route.routeFaq }}</h2>
        </div>
        <div class="faq-list">
          <article v-for="item in page.faq" :key="item.question" class="faq-item route-faq-item">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
          </article>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { SeoLandingPage } from '~/data/seo-pages'

const props = defineProps<{
  page: SeoLandingPage
}>()

const { text, businessText, routeOffers, tourPhotos, localePath } = useLocaleContent()

useAnturSeo({
  title: props.page.seoTitle,
  description: props.page.seoDescription,
  path: `/${props.page.slug}`,
  image: props.page.heroImage,
  localized: false
})
useBusinessSchema()

const pageRoutes = computed(() =>
  props.page.routeSlugs.flatMap((slug) => {
    const offer = routeOffers.value.find((item) => item.slug === slug)
    return offer ? [offer] : []
  })
)
const pagePhotos = computed(() => {
  const photos = tourPhotos.value.filter((photo) => photo.kind !== 'video')
  const selected = props.page.photoIds?.flatMap((id) => {
    const photo = photos.find((item) => item.id === id)
    return photo ? [photo] : []
  }) || []

  return (selected.length ? selected : photos).slice(0, 3)
})
const assetPath = useAssetPath()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string
const pageUrl = new URL(assetPath(`/${props.page.slug}`), siteUrl).toString()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        name: props.page.title,
        description: props.page.description,
        url: pageUrl,
        dateModified: props.page.updatedAt,
        mainEntity: pageRoutes.value.map((offer) => ({
          '@type': 'TouristTrip',
          name: offer.title,
          url: new URL(assetPath(`/routes/${offer.slug}`), siteUrl).toString(),
          offers: offer.price ? {
            '@type': 'Offer',
            priceCurrency: 'RUB',
            description: offer.price
          } : undefined
        }))
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.page.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer
          }
        }))
      })
    }
  ]
})
</script>

<template>
  <article>
    <section class="route-hero seo-landing-hero">
      <OptimizedImage
        :src="page.heroImage"
        :mobile-src="page.heroMobileImage"
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
          <NuxtLink v-if="breadcrumbParent" :to="breadcrumbParent.path">{{ breadcrumbParent.title }}</NuxtLink>
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

    <section v-if="page.links?.length" class="section route-extra-section seo-link-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ page.linksEyebrow || page.eyebrow }}</p>
          <h2>{{ page.linksTitle || text.route.otherRoutes }}</h2>
        </div>
        <div class="route-extra-grid">
          <NuxtLink v-for="link in page.links" :key="link.path" class="detail-panel detail-panel-link" :to="link.path">
            <span>{{ link.eyebrow || page.eyebrow }}</span>
            <strong>{{ link.title }}</strong>
            <p>{{ link.text }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section v-if="pageMedia.length" class="section route-gallery-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.home.galleryEyebrow }}</p>
          <h2>{{ text.route.routePhotos }}</h2>
        </div>
        <div class="gallery-list">
          <article v-for="media in pageMedia" :key="media.id" class="photo-card" :class="{ 'video-card': media.kind === 'video' }">
            <video
              v-if="media.kind === 'video'"
              controls
              playsinline
              preload="metadata"
              :poster="media.posterSrc ? assetPath(media.posterSrc) : undefined"
              :aria-label="media.alt"
            >
              <source :src="assetPath(media.videoSrc || media.src)" type="video/mp4">
            </video>
            <OptimizedImage
              v-else
              :src="media.src"
              width="900"
              height="900"
              sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 31vw"
              :widths="[480, 720, 960]"
              loading="lazy"
              :alt="media.alt"
            />
            <div class="photo-card-caption">
              <strong>{{ media.route }}</strong>
              <p>{{ media.caption || media.alt }}</p>
            </div>
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

const { text, businessText, localePath } = useLocaleContent()
const { routeOffers } = useRouteContent()
const { tourPhotos } = useSocialProof()

useAnturSeo({
  title: props.page.seoTitle,
  description: props.page.seoDescription,
  path: props.page.path,
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
const pageMedia = computed(() => {
  const media = tourPhotos.value
  const selected = props.page.photoIds?.flatMap((id) => {
    const item = media.find((entry) => entry.id === id)
    return item ? [item] : []
  }) || []

  return (selected.length ? selected : media).slice(0, 3)
})
const assetPath = useAssetPath()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string
const pageUrl = new URL(assetPath(props.page.path), siteUrl).toString()
const homeUrl = new URL(assetPath('/'), siteUrl).toString()
const breadcrumbParent = computed(() => {
  if (props.page.path.startsWith('/morskie-progulki/') && props.page.path !== '/morskie-progulki/') {
    return { title: 'Морские прогулки', path: '/morskie-progulki/' }
  }

  if (props.page.path.startsWith('/rybalka/') && props.page.path !== '/rybalka/') {
    return { title: 'Рыбалка', path: '/rybalka/' }
  }

  return null
})
const breadcrumbItems = computed(() => [
  {
    '@type': 'ListItem',
    position: 1,
    name: businessText.value.brand,
    item: homeUrl
  },
  ...(breadcrumbParent.value
    ? [{
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbParent.value.title,
        item: new URL(assetPath(breadcrumbParent.value.path), siteUrl).toString()
      }]
    : []),
  {
    '@type': 'ListItem',
    position: breadcrumbParent.value ? 3 : 2,
    name: props.page.title,
    item: pageUrl
  }
])

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
          url: new URL(assetPath(offer.path), siteUrl).toString(),
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
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.value
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(buildFaqSchema(props.page.faq))
    }
  ]
})
</script>

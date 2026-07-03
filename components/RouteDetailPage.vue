<template>
  <article v-if="offer">
    <section class="route-hero">
      <OptimizedImage
        :src="heroImage"
        width="1600"
        height="900"
        sizes="100vw"
        :widths="[720, 960, 1280, 1600]"
        loading="eager"
        fetchpriority="high"
        :alt="heroImageAlt"
      />
      <div class="route-hero-overlay" />
      <div class="container route-hero-content">
        <nav class="route-breadcrumbs" :aria-label="text.navAria">
          <NuxtLink :to="localePath('/')">{{ businessText.brand }}</NuxtLink>
          <NuxtLink :to="offer.categoryPath || localePath('/#routes')">{{ offer.categoryTitle || text.home.routesTitle }}</NuxtLink>
          <span>{{ offer.title }}</span>
        </nav>
        <p class="eyebrow">{{ offer.kicker }}</p>
        <h1>{{ offer.title }}</h1>
        <p>{{ offer.description }}</p>
        <div class="hero-actions">
          <ContactButton :label="text.route.date" :context="offer.title" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container route-detail-grid">
        <div>
          <p class="eyebrow">{{ text.route.program }}</p>
          <h2>{{ text.route.includes }}</h2>
          <div class="route-facts">
            <div>
              <span>{{ text.route.duration }}</span>
              <strong>{{ offer.duration }}</strong>
            </div>
            <div v-if="offer.price">
              <span>{{ text.route.price }}</span>
              <strong>{{ offer.price }}</strong>
            </div>
          </div>
          <ul class="detail-list">
            <li v-for="highlight in offer.highlights" :key="highlight">
              <span class="detail-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path v-for="path in getHighlightIconPaths(highlight)" :key="path" :d="path" />
                </svg>
              </span>
              <span>{{ highlight }}</span>
            </li>
          </ul>

          <div v-if="offer.priceOptions?.length" class="price-options">
            <p class="eyebrow">{{ text.route.currentPrice }}</p>
            <h2>{{ text.route.seasonalPrice }}</h2>
            <div class="price-table">
              <div v-for="option in offer.priceOptions" :key="`${option.season}-${option.format}`" class="price-row">
                <span>{{ option.season }}</span>
                <strong>{{ option.format }}</strong>
                <b>{{ option.price }}</b>
              </div>
            </div>
          </div>

          <ul v-if="bookingTerms.length" class="terms-list">
            <li v-for="term in bookingTerms" :key="term">{{ term }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="hasExtendedContent" class="section route-extra-section">
      <div class="container route-extra-grid">
        <div v-if="offer.audience?.length" class="detail-panel">
          <span>{{ text.route.audience }}</span>
          <ul class="route-text-list">
            <li v-for="item in offer.audience" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div v-if="offer.included?.length" class="detail-panel">
          <span>{{ text.route.includedDetails }}</span>
          <ul class="route-text-list">
            <li v-for="item in offer.included" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div v-if="offer.notIncluded?.length" class="detail-panel">
          <span>{{ text.route.notIncluded }}</span>
          <ul class="route-text-list">
            <li v-for="item in offer.notIncluded" :key="item">{{ item }}</li>
          </ul>
        </div>

        <div v-if="offer.bring?.length" class="detail-panel">
          <span>{{ text.route.bring }}</span>
          <ul class="route-text-list">
            <li v-for="item in offer.bring" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="offer.timeline?.length" class="section route-timeline-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.route.program }}</p>
          <h2>{{ text.route.timeline }}</h2>
        </div>
        <ol class="route-timeline">
          <li v-for="(item, index) in offer.timeline" :key="item.title">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section v-if="offer.weather || offer.children || offer.meetingPoint" class="section route-info-section">
      <div class="container route-info-grid">
        <div v-if="offer.weather" class="detail-panel">
          <span>{{ text.route.weather }}</span>
          <p>{{ offer.weather }}</p>
        </div>
        <div v-if="offer.children" class="detail-panel">
          <span>{{ text.route.children }}</span>
          <p>{{ offer.children }}</p>
        </div>
        <div v-if="offer.meetingPoint" class="detail-panel">
          <span>{{ text.route.meetingPoint }}</span>
          <p>{{ offer.meetingPoint }}</p>
        </div>
      </div>
    </section>

    <section v-if="offer.gallery?.length" class="section route-gallery-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.home.galleryEyebrow }}</p>
          <h2>{{ text.route.routePhotos }}</h2>
        </div>
        <div class="route-gallery-list">
          <figure v-for="item in offer.gallery" :key="item.src" class="section-photo route-gallery-item">
            <OptimizedImage
              :src="item.src"
              width="900"
              height="675"
              sizes="(max-width: 760px) 92vw, 31vw"
              :widths="[480, 720, 960]"
              loading="lazy"
              :alt="item.alt"
            />
          </figure>
        </div>
      </div>
    </section>

    <section v-if="routeReviews.length" class="section route-reviews-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.home.reviewsEyebrow }}</p>
          <h2>{{ text.route.routeReviews }}</h2>
        </div>
        <ReviewSlider :reviews="routeReviews" :label="text.route.routeReviews" :link-routes="false" />
      </div>
    </section>

    <section v-if="offer.routeFaq?.length" class="section route-faq-section">
      <div class="container faq-grid">
        <div>
          <p class="eyebrow">{{ text.home.faqEyebrow }}</p>
          <h2>{{ text.route.routeFaq }}</h2>
        </div>
        <div class="faq-list">
          <article v-for="item in offer.routeFaq" :key="item.question" class="faq-item route-faq-item">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-if="relatedRoutes.length" class="section routes route-related-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ text.home.routesEyebrow }}</p>
          <h2>{{ text.route.otherRoutes }}</h2>
        </div>
        <div class="route-grid">
          <RouteCard v-for="item in relatedRoutes" :key="item.slug" :offer="item" />
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { getLocalizedRoutePath, getLocalizedRoutePaths } from '~/data/routes'
import { sortReviewsByDateDesc } from '~/utils/reviews'

const route = useRoute()
const { locale, text, businessText, routeOffers, bookingTerms, reviews, localePath } = useLocaleContent()
const routeSlug = computed(() => String(route.params.slug || ''))
const offer = computed(() =>
  routeOffers.value.find((item) => item.slug === routeSlug.value || item.pathSlug === routeSlug.value)
)

if (!offer.value) {
  throw createError({ statusCode: 404, statusMessage: text.value.route.missing })
}
const initialOffer = offer.value

const heroImage = computed(() => offer.value?.pageImage || offer.value?.image || '')
const heroImageAlt = computed(() => offer.value?.pageImageAlt || offer.value?.imageAlt || '')
const hasExtendedContent = computed(() =>
  Boolean(
    offer.value?.audience?.length ||
    offer.value?.included?.length ||
    offer.value?.notIncluded?.length ||
    offer.value?.bring?.length
  )
)
const routeReviews = computed(() => {
  const currentOffer = offer.value

  if (!currentOffer) {
    return []
  }

  if (currentOffer.reviewIds?.length) {
    return sortReviewsByDateDesc(
      currentOffer.reviewIds.flatMap((id) => {
        const review = reviews.value.find((item) => item.id === id)
        return review ? [review] : []
      })
    ).slice(0, 3)
  }

  return sortReviewsByDateDesc(reviews.value.filter((review) => review.routeSlug === currentOffer.slug)).slice(0, 3)
})
const relatedRoutes = computed(() =>
  offer.value?.relatedSlugs?.length
    ? offer.value.relatedSlugs.flatMap((slug) => {
        const relatedOffer = routeOffers.value.find((item) => item.slug === slug)
        return relatedOffer ? [relatedOffer] : []
      })
    : routeOffers.value.filter((item) => item.slug !== offer.value?.slug).slice(0, 3)
)
const highlightIconPaths = {
  users: [
    'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M3.5 20a5.5 5.5 0 0 1 11 0',
    'M13 15.2A5.5 5.5 0 0 1 20.5 20'
  ],
  fishing: [
    'M6 4v9a5 5 0 0 0 10 0V6',
    'M16 6h2.5a3.5 3.5 0 0 1 0 7H16',
    'M6 4h10',
    'M10 18v3'
  ],
  crab: [
    'M7 13a5 5 0 0 0 10 0',
    'M8 9h8',
    'M5 9 2.5 6',
    'M19 9l2.5 6',
    'M9 16l-2 3',
    'M15 16l2 3'
  ],
  compass: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'm15.5 8.5-2.2 5.8-5.8 2.2 2.2-5.8 5.8-2.2Z'
  ],
  clock: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
    'M12 7v5l3 2'
  ],
  calendar: [
    'M5 5h14v16H5z',
    'M8 3v4',
    'M16 3v4',
    'M5 10h14'
  ],
  wave: [
    'M3 15c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2S20.6 15 23 15',
    'M3 19c2.4 0 2.4-2 4.8-2s2.4 2 4.8 2 2.4-2 4.8-2S20.6 19 23 19'
  ]
}

const getHighlightIconPaths = (highlight: string) => {
  const normalized = highlight.toLowerCase()

  if (normalized.includes('человек') || normalized.includes('групп')) {
    return highlightIconPaths.users
  }

  if (normalized.includes('guest') || normalized.includes('group') || normalized.includes('人') || normalized.includes('成团')) {
    return highlightIconPaths.users
  }

  if (normalized.includes('снасти') || normalized.includes('рыбал') || normalized.includes('fishing') || normalized.includes('tackle') || normalized.includes('钓') || normalized.includes('钓具')) {
    return highlightIconPaths.fishing
  }

  if (normalized.includes('краб') || normalized.includes('crab') || normalized.includes('蟹')) {
    return highlightIconPaths.crab
  }

  if (normalized.includes('час') || normalized.includes('hour') || normalized.includes('小时')) {
    return highlightIconPaths.clock
  }

  if (normalized.includes('май') || normalized.includes('сентябрь') || normalized.includes('may') || normalized.includes('september') || normalized.includes('月')) {
    return highlightIconPaths.calendar
  }

  if (normalized.includes('бухт') || normalized.includes('остров') || normalized.includes('берег') || normalized.includes('кекур') || normalized.includes('маршрут') || normalized.includes('bay') || normalized.includes('island') || normalized.includes('shore') || normalized.includes('route') || normalized.includes('湾') || normalized.includes('岛') || normalized.includes('岸') || normalized.includes('路线')) {
    return highlightIconPaths.compass
  }

  return highlightIconPaths.wave
}

const routeCanonicalPath = getLocalizedRoutePath(initialOffer.slug, locale.value)

useAnturSeo({
  title: initialOffer.seoTitle || `${initialOffer.title} ${text.value.route.seoSuffix}`,
  description: initialOffer.seoDescription || initialOffer.description,
  path: routeCanonicalPath,
  image: heroImage.value,
  localizedPaths: getLocalizedRoutePaths(initialOffer.slug)
})
useBusinessSchema()

const parseRubPrice = (price: string) => {
  const digits = price.replace(/\D/g, '')
  return digits ? Number(digits) : undefined
}
const assetPath = useAssetPath()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string
const homeUrl = new URL(assetPath(localePath('/')), siteUrl).toString()
const routeUrl = new URL(assetPath(routeCanonicalPath), siteUrl).toString()
const categoryUrl = new URL(assetPath(initialOffer.categoryPath || '/'), siteUrl).toString()
const routeImageUrl = new URL(assetPath(heroImage.value), siteUrl).toString()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        '@id': `${routeUrl}#tour`,
        name: initialOffer.title,
        description: initialOffer.description,
        url: routeUrl,
        image: routeImageUrl,
        duration: initialOffer.duration,
        touristType: text.value.route.touristTypes,
        areaServed: ['Камчатка', 'Петропавловск-Камчатский', 'Авачинская бухта'],
        offers: initialOffer.priceOptions?.map((option) => ({
          '@type': 'Offer',
          name: option.format,
          description: `${option.season}. ${option.price}`,
          price: parseRubPrice(option.price),
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
          validFrom: initialOffer.updatedAt
        })),
        provider: {
          '@type': 'TravelAgency',
          name: businessText.value.brand,
          telephone: '+79140253972',
          url: homeUrl
        },
        itinerary: (initialOffer.timeline?.length ? initialOffer.timeline : initialOffer.highlights.map((highlight) => ({ title: highlight, text: highlight }))).map((item) => ({
          '@type': 'CreativeWork',
          name: item.title,
          description: item.text
        }))
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: businessText.value.brand,
            item: homeUrl
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: initialOffer.categoryTitle || text.value.home.routesTitle,
            item: categoryUrl
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: initialOffer.title,
            item: routeUrl
          }
        ]
      })
    },
    ...(initialOffer.routeFaq?.length
      ? [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify(buildFaqSchema(initialOffer.routeFaq))
        }]
      : [])
  ]
})
</script>

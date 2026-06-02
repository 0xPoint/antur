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
  </article>
</template>

<script setup lang="ts">
definePageMeta({
  alias: ['/en/routes/:slug', '/zh/routes/:slug']
})

const route = useRoute()
const { text, businessText, routeOffers, bookingTerms } = useLocaleContent()
const offer = computed(() => routeOffers.value.find((item) => item.slug === route.params.slug))

if (!offer.value) {
  throw createError({ statusCode: 404, statusMessage: text.value.route.missing })
}
const initialOffer = offer.value

const heroImage = computed(() => offer.value?.pageImage || offer.value?.image || '')
const heroImageAlt = computed(() => offer.value?.pageImageAlt || offer.value?.imageAlt || '')
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

useAnturSeo({
  title: `${initialOffer.title} ${text.value.route.seoSuffix}`,
  description: initialOffer.description,
  path: `/routes/${initialOffer.slug}`,
  image: heroImage.value
})
useBusinessSchema()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: initialOffer.title,
        description: initialOffer.description,
        touristType: text.value.route.touristTypes,
        provider: {
          '@type': 'TravelAgency',
          name: businessText.value.brand,
          telephone: '+79140253972'
        },
        itinerary: initialOffer.highlights
      })
    }
  ]
})
</script>

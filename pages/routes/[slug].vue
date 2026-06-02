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
          <ContactButton label="Уточнить дату" :context="offer.title" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container route-detail-grid">
        <div>
          <p class="eyebrow">Программа</p>
          <h2>Что входит</h2>
          <div class="route-facts">
            <div>
              <span>Длительность</span>
              <strong>{{ offer.duration }}</strong>
            </div>
            <div v-if="offer.price">
              <span>Стоимость</span>
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
            <p class="eyebrow">Актуальный прайс</p>
            <h2>Цены по сезону и формату</h2>
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
import { bookingTerms, business } from '~/data/site'
import { routeOffers } from '~/data/routes'

const route = useRoute()
const offer = routeOffers.find((item) => item.slug === route.params.slug)

if (!offer) {
  throw createError({ statusCode: 404, statusMessage: 'Маршрут не найден' })
}

const heroImage = offer.pageImage || offer.image
const heroImageAlt = offer.pageImageAlt || offer.imageAlt
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

  if (normalized.includes('снасти') || normalized.includes('рыбал')) {
    return highlightIconPaths.fishing
  }

  if (normalized.includes('краб')) {
    return highlightIconPaths.crab
  }

  if (normalized.includes('час')) {
    return highlightIconPaths.clock
  }

  if (normalized.includes('май') || normalized.includes('сентябрь')) {
    return highlightIconPaths.calendar
  }

  if (normalized.includes('бухт') || normalized.includes('остров') || normalized.includes('берег') || normalized.includes('кекур') || normalized.includes('маршрут')) {
    return highlightIconPaths.compass
  }

  return highlightIconPaths.wave
}

useAnturSeo({
  title: `${offer.title} на Камчатке | Антур`,
  description: offer.description,
  path: `/routes/${offer.slug}`,
  image: heroImage
})
useBusinessSchema()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: offer.title,
        description: offer.description,
        touristType: ['рыбалка', 'морская прогулка', 'Камчатка'],
        provider: {
          '@type': 'TravelAgency',
          name: business.brand,
          telephone: '+79140253972'
        },
        itinerary: offer.highlights
      })
    }
  ]
})
</script>

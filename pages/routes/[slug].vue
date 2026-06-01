<template>
  <article v-if="offer">
    <section class="route-hero">
      <img :src="assetPath(heroImage)" width="1600" height="900" :alt="heroImageAlt">
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
            <li v-for="highlight in offer.highlights" :key="highlight">{{ highlight }}</li>
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
const assetPath = useAssetPath()

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

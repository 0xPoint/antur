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
        <nav class="route-breadcrumbs" aria-label="Breadcrumbs">
          <NuxtLink to="/en/">Antur</NuxtLink>
          <span>Boat charter</span>
        </nav>
        <p class="eyebrow">Kamchatka boat charter</p>
        <h1>{{ page.title }}</h1>
        <p>{{ page.description }}</p>
        <div class="hero-actions">
          <ContactButton label="Check dates and price" context="Kamchatka private boat charter" />
        </div>
      </div>
    </section>

    <section class="section route-extra-section">
      <div class="container route-extra-grid">
        <article v-for="section in page.sections" :key="section.title" class="detail-panel">
          <span>Private charter</span>
          <strong>{{ section.title }}</strong>
          <p>{{ section.text }}</p>
        </article>
      </div>
    </section>

    <section class="section routes">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Charter programs</p>
          <h2>Choose the route for your group</h2>
        </div>
        <div class="route-grid">
          <RouteCard v-for="offer in charterRoutes" :key="offer.slug" :offer="offer" />
        </div>
      </div>
    </section>

    <section class="section route-faq-section">
      <div class="container faq-grid">
        <div>
          <p class="eyebrow">FAQ</p>
          <h2>Before booking a private boat</h2>
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
import { boatCharterPage as page } from '~/data/boat-charter'

const { routeOffers } = useRouteContent()
const charterRoutes = computed(() => page.routeSlugs.flatMap((slug) => {
  const offer = routeOffers.value.find((item) => item.slug === slug)
  return offer ? [offer] : []
}))

const seo = useAnturSeo({
  title: page.seoTitle,
  description: page.seoDescription,
  path: page.path,
  image: page.heroImage,
  localized: false,
  preservePath: true
})
useBusinessSchema()

const assetPath = useAssetPath()
const pageUrl = new URL(assetPath(page.path), seo.siteUrl).toString()
const homeUrl = new URL(assetPath('/en/'), seo.siteUrl).toString()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${pageUrl}#service`,
        name: page.title,
        description: page.description,
        url: pageUrl,
        image: new URL(assetPath(page.heroImage), seo.siteUrl).toString(),
        areaServed: ['Kamchatka', 'Petropavlovsk-Kamchatsky'],
        provider: { '@id': `${homeUrl}#organization` },
        offers: charterRoutes.value.flatMap((offer) => offer.priceOptions || []).map((option) => ({
          '@type': 'Offer',
          priceCurrency: 'RUB',
          description: `${option.season}: ${option.format} — ${option.price}`
        }))
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(buildFaqSchema([...page.faq]))
    }
  ]
})
</script>

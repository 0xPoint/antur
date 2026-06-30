<template>
  <article>
    <section class="route-hero info-hero">
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
        <div v-for="panel in page.panels" :key="panel.title" class="detail-panel">
          <span>{{ page.eyebrow }}</span>
          <strong>{{ panel.title }}</strong>
          <p>{{ panel.text }}</p>
        </div>
      </div>
    </section>

    <section class="section info-content-section">
      <div class="container info-content-grid">
        <div class="info-section-list">
          <article v-for="section in page.sections" :key="section.title" class="info-section-item">
            <h2>{{ section.title }}</h2>
            <p>{{ section.text }}</p>
          </article>
        </div>
        <aside class="info-checklist" :aria-labelledby="`${page.slug}-checklist`">
          <h2 :id="`${page.slug}-checklist`">{{ page.checklistTitle }}</h2>
          <ul class="route-text-list">
            <li v-for="item in page.checklist" :key="item">{{ item }}</li>
          </ul>
        </aside>
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
import type { InfoPage } from '~/data/info-pages'

const props = defineProps<{
  page: InfoPage
}>()

const { text, businessText, localePath } = useLocaleContent()

const seo = useAnturSeo({
  title: props.page.seoTitle,
  description: props.page.seoDescription,
  path: `/${props.page.slug}`,
  image: props.page.heroImage,
  localized: false
})
useBusinessSchema()

const assetPath = useAssetPath()
const pageUrl = new URL(assetPath(`/${props.page.slug}`), seo.siteUrl).toString()
const homeUrl = new URL(assetPath('/'), seo.siteUrl).toString()

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': props.page.schemaType,
        '@id': `${pageUrl}#webpage`,
        name: props.page.title,
        description: props.page.description,
        url: pageUrl,
        image: new URL(assetPath(props.page.heroImage), seo.siteUrl).toString(),
        dateModified: props.page.updatedAt,
        isPartOf: {
          '@type': 'WebSite',
          name: businessText.value.brand,
          url: homeUrl
        }
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
            name: props.page.title,
            item: pageUrl
          }
        ]
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

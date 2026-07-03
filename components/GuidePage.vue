<template>
  <article>
    <section class="route-hero info-hero guide-hero">
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
          <ContactButton :label="page.ctaLabel || text.contact.bookTrip" :context="page.ctaContext" />
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
        <aside class="info-checklist guide-service-panel" :aria-labelledby="`${page.slug}-services`">
          <p class="eyebrow">{{ page.linksEyebrow || 'Маршруты по теме' }}</p>
          <h2 :id="`${page.slug}-services`">{{ page.linksTitle || 'Выбрать морской выход' }}</h2>
          <div class="guide-service-links">
            <NuxtLink v-for="link in page.serviceLinks" :key="link.path" class="guide-service-link" :to="link.path">
              <span>{{ link.eyebrow }}</span>
              <strong>{{ link.title }}</strong>
              <p>{{ link.text }}</p>
            </NuxtLink>
          </div>
        </aside>
      </div>
    </section>

    <section v-if="relatedPages.length" class="section route-extra-section seo-link-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Полезно туристу</p>
          <h2>Еще по теме</h2>
        </div>
        <div class="route-extra-grid">
          <NuxtLink v-for="related in relatedPages" :key="related.path" class="detail-panel detail-panel-link" :to="related.path">
            <span>{{ related.eyebrow }}</span>
            <strong>{{ related.title }}</strong>
            <p>{{ related.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section route-faq-section">
      <div class="container faq-grid">
        <div>
          <p class="eyebrow">{{ text.home.faqEyebrow }}</p>
          <h2>{{ page.faqTitle || 'Вопросы по теме' }}</h2>
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
import { guidePages, type GuidePage } from '~/data/guide-pages'

const props = defineProps<{
  page: GuidePage
}>()

const { text, businessText, localePath } = useLocaleContent()

const seo = useAnturSeo({
  title: props.page.seoTitle,
  description: props.page.seoDescription,
  path: props.page.path,
  image: props.page.heroImage,
  localized: false
})
useBusinessSchema()

const assetPath = useAssetPath()
const pageUrl = new URL(assetPath(props.page.path), seo.siteUrl).toString()
const homeUrl = new URL(assetPath('/'), seo.siteUrl).toString()
const imageUrl = new URL(assetPath(props.page.heroImage), seo.siteUrl).toString()
const relatedPages = computed(() =>
  props.page.relatedSlugs.flatMap((slug) => {
    const related = guidePages.find((item) => item.slug === slug)
    return related ? [related] : []
  })
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: props.page.title,
        description: props.page.description,
        image: imageUrl,
        dateModified: props.page.updatedAt,
        datePublished: props.page.updatedAt,
        mainEntityOfPage: pageUrl,
        author: {
          '@id': `${homeUrl}#organization`
        },
        publisher: {
          '@id': `${homeUrl}#organization`
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
      innerHTML: JSON.stringify(buildFaqSchema(props.page.faq))
    }
  ]
})
</script>

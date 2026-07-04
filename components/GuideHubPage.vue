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
          <ContactButton :label="page.ctaLabel" :context="page.ctaContext" />
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

    <section v-for="section in guideSections" :key="section.title" class="section route-extra-section seo-link-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.title }}</h2>
          <p class="hub-section-copy">{{ section.description }}</p>
        </div>
        <div class="route-extra-grid">
          <NuxtLink v-for="guide in section.pages" :key="guide.path" class="detail-panel detail-panel-link" :to="guide.path">
            <span>{{ guide.eyebrow }}</span>
            <strong>{{ guide.title }}</strong>
            <p>{{ guide.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section route-extra-section seo-link-section">
      <div class="container">
        <div class="section-heading">
          <p class="eyebrow">Хабы</p>
          <h2>Куда перейти дальше</h2>
          <p class="hub-section-copy">Если уже выбираете конкретный морской день, переходите в хабы маршрутов, рыбалки и живого сезона.</p>
        </div>
        <div class="route-extra-grid">
          <NuxtLink v-for="link in page.serviceLinks" :key="link.path" class="detail-panel detail-panel-link" :to="link.path">
            <span>{{ link.eyebrow }}</span>
            <strong>{{ link.title }}</strong>
            <p>{{ link.text }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section route-faq-section">
      <div class="container faq-grid">
        <div>
          <p class="eyebrow">{{ text.home.faqEyebrow }}</p>
          <h2>Вопросы по гайдам</h2>
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
import { guidePages } from '~/data/guide-pages'
import type { GuideHubPage } from '~/data/guide-hub'

const props = defineProps<{
  page: GuideHubPage
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
const guideBySlug = new Map(guidePages.map((guide) => [guide.slug, guide] as const))
const guideSections = computed(() =>
  props.page.sections.map((section) => ({
    ...section,
    pages: section.slugs.flatMap((slug) => {
      const guide = guideBySlug.get(slug)
      return guide ? [guide] : []
    })
  }))
)
const guideItemList = computed(() =>
  guideSections.value.flatMap((section) => section.pages).map((guide, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: guide.title,
    url: new URL(assetPath(guide.path), seo.siteUrl).toString()
  }))
)

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${pageUrl}#collection`,
        name: props.page.title,
        description: props.page.description,
        url: pageUrl,
        image: imageUrl,
        dateModified: props.page.updatedAt,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: guideItemList.value
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

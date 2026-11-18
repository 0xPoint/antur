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
          <span>{{ page.breadcrumbTitle }}</span>
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
      <div class="container guide-shortcuts">
        <p>С чего начать</p>
        <nav aria-label="Разделы полезных советов">
          <a href="#guide-section-0">Когда ехать</a>
          <a href="#guide-section-1">Что взять в море</a>
          <a href="#guide-section-2">Как выбрать маршрут</a>
        </nav>
      </div>
    </section>

    <section v-for="(section, index) in guideSections" :id="`guide-section-${index}`" :key="section.title" class="section route-extra-section seo-link-section">
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
          <p class="eyebrow">Морские прогулки</p>
          <h2>Выберите свой морской день</h2>
          <p class="hub-section-copy">Посмотрите маршруты, рыбалку и фотографии с наших выходов.</p>
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
          <h2>Перед поездкой</h2>
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

<style scoped>
.guide-shortcuts {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 18px 32px;
}
.guide-shortcuts p {
  margin: 0;
  color: var(--gold);
  font-size: 0.875rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.guide-shortcuts nav { display: flex; flex-wrap: wrap; gap: 12px; }
.guide-shortcuts a {
  padding: 10px 16px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 8px;
  color: var(--white);
  font-weight: 700;
}
.guide-shortcuts a:hover { border-color: var(--gold); }
.seo-link-section { scroll-margin-top: 90px; }
</style>

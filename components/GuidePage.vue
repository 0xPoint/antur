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
          <NuxtLink :to="guideHubPage.path">{{ guideHubPage.breadcrumbTitle }}</NuxtLink>
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
        <div class="guide-main-content">
          <aside class="guide-byline" aria-label="Авторство и экспертная проверка">
            <div>
              <span>Автор</span>
              <strong>{{ editorialProfile.authorName }}</strong>
            </div>
            <div>
              <span>Экспертная проверка</span>
              <strong>{{ editorialProfile.reviewerName }}</strong>
              <small>{{ editorialProfile.reviewerRole }}</small>
            </div>
            <p>{{ editorialProfile.experienceNote }}</p>
            <time :datetime="dateModified">Обновлено {{ formattedModifiedDate }}</time>
          </aside>
          <div class="info-section-list">
            <article v-for="section in page.sections" :key="section.title" class="info-section-item">
              <h2>{{ section.title }}</h2>
              <p>{{ section.text }}</p>
            </article>
          </div>
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
import { guideHubPage } from '~/data/guide-hub'
import { guidePages, type GuidePage } from '~/data/guide-pages'
import { editorialProfile } from '~/data/editorial'

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
const guideHubUrl = new URL(assetPath(guideHubPage.path), seo.siteUrl).toString()
const imageUrl = new URL(assetPath(props.page.heroImage), seo.siteUrl).toString()
const dateModified = props.page.updatedAt > editorialProfile.updatedAt
  ? props.page.updatedAt
  : editorialProfile.updatedAt
const formattedModifiedDate = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format(new Date(`${dateModified}T12:00:00+12:00`))
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
        dateModified,
        datePublished: props.page.updatedAt,
        mainEntityOfPage: pageUrl,
        author: {
          '@type': 'Organization',
          '@id': `${homeUrl}#organization`,
          name: editorialProfile.authorName
        },
        reviewedBy: {
          '@type': 'Person',
          name: editorialProfile.reviewerName,
          jobTitle: editorialProfile.reviewerRole,
          worksFor: {
            '@id': `${homeUrl}#organization`
          }
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
            name: guideHubPage.breadcrumbTitle,
            item: guideHubUrl
          },
          {
            '@type': 'ListItem',
            position: 3,
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

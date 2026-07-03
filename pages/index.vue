<template>
  <div>
    <HeroSection />

    <div class="landing-flow landing-flow-primary">
      <section id="routes" class="section routes" aria-labelledby="routes-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">{{ text.home.routesEyebrow }}</p>
            <h2 id="routes-title">{{ text.home.routesTitle }}</h2>
          </div>
          <div class="route-grid route-grid--featured">
            <RouteCard v-for="offer in homeRouteOffers" :key="offer.slug" :offer="offer" />
          </div>
        </div>
      </section>

      <section class="section intro" aria-labelledby="intro-title">
        <div class="container intro-grid">
          <div>
            <p class="eyebrow">{{ text.home.introEyebrow }}</p>
            <h2 id="intro-title">{{ text.home.introTitle }}</h2>
            <p>{{ text.home.introText }}</p>
          </div>
          <figure class="section-photo intro-photo">
            <OptimizedImage
              src="/images/kamchatka-ocean-rocks.jpg"
              width="1400"
              height="788"
              sizes="(max-width: 820px) 92vw, 44vw"
              :widths="[480, 720, 960]"
              loading="lazy"
              :alt="text.home.introAlt"
            />
          </figure>
        </div>
      </section>

      <section id="gallery" v-if="showFreshPhotos" class="section gallery" aria-labelledby="gallery-title">
        <div class="container gallery-grid">
          <div class="gallery-copy">
            <p class="eyebrow">{{ text.home.galleryEyebrow }}</p>
            <h2 id="gallery-title">{{ text.home.galleryTitle }}</h2>
            <p>{{ text.home.galleryText }}</p>
            <NuxtLink class="card-link dark-link" :to="localePath('/gallery')">{{ text.home.galleryLink }}</NuxtLink>
          </div>
          <LazyTourMediaSlider
            :items="tourPhotos"
            :labels="text.home.gallerySlider"
          />
        </div>
      </section>

      <section id="safety" class="section safety" aria-labelledby="safety-title">
        <div class="container safety-grid">
          <div class="safety-copy">
          <p class="eyebrow">{{ text.home.safetyEyebrow }}</p>
          <h2 id="safety-title">{{ text.home.safetyTitle }}</h2>
          <p>{{ text.home.safetyText }}</p>
          </div>
          <div class="proof-grid">
            <div v-for="(item, index) in proofItems" :key="item.title" class="proof-item">
              <span aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
              <strong>{{ item.title }}</strong>
              <p>{{ item.text }}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="booking" class="section booking" aria-labelledby="booking-title">
        <div class="container booking-panel">
          <div class="booking-copy">
            <p class="eyebrow">{{ text.home.bookingEyebrow }}</p>
            <h2 id="booking-title">{{ text.home.bookingTitle }}</h2>
            <p>{{ text.home.bookingText }}</p>
            <div class="booking-actions">
              <ContactButton :label="text.home.bookingButton" :context="text.home.bookingContext" />
            </div>
          </div>
          <OptimizedImage
            class="booking-image"
            src="/images/antur-kamchatka-crab-wine-deck-2026-06-14.jpg"
            width="900"
            height="675"
            sizes="(max-width: 760px) 82vw, 34vw"
            :widths="[480, 720, 960]"
            loading="lazy"
            :alt="text.home.bookingAlt"
          />
        </div>
      </section>
    </div>

    <div class="landing-flow landing-flow-qa">
      <section id="faq" class="section faq" aria-labelledby="faq-title">
        <div class="container faq-grid">
          <div>
            <p class="eyebrow">{{ text.home.faqEyebrow }}</p>
            <h2 id="faq-title">{{ text.home.faqTitle }}</h2>
            <figure class="section-photo faq-photo">
              <OptimizedImage
                src="/images/faq-preview.png"
                width="1731"
                height="909"
                sizes="(max-width: 820px) 92vw, 40vw"
                :widths="[480, 720, 960]"
                loading="lazy"
                :alt="text.home.faqAlt"
              />
            </figure>
          </div>
          <div class="faq-list">
            <div v-for="(item, index) in faqItems" :key="item.question" class="faq-item">
              <button
                class="faq-question"
                type="button"
                :aria-expanded="openFaqIndex === index"
                :aria-controls="`faq-answer-${index}`"
                @click="toggleFaq(index)"
              >
                <span>{{ item.question }}</span>
                <span class="faq-toggle" aria-hidden="true"></span>
              </button>
              <div :id="`faq-answer-${index}`" class="faq-answer" :class="{ open: openFaqIndex === index }">
                <p>{{ item.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" class="section reviews-section" aria-labelledby="reviews-title">
        <div class="container">
          <div class="reviews-head">
            <div class="section-heading">
              <p class="eyebrow">{{ text.home.reviewsEyebrow }}</p>
              <h2 id="reviews-title">{{ text.home.reviewsTitle }}</h2>
            </div>
          </div>
          <ReviewSlider :reviews="reviews" :label="text.home.reviewsAria" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  alias: ['/en', '/zh']
})

const { locale, text, routeOffers, faqItems, reviews, tourPhotos, localePath } = useLocaleContent()

useAnturSeo({
  title: text.value.home.seoTitle,
  description: text.value.home.seoDescription
})
useBusinessSchema()
useFaqSchema()

const showFreshPhotos = true
const routeOrder = [
  'avachinskaya-buhta',
  'ostrov-starichkov',
  'buhta-russkaya',
  'rybalka',
  'glubokovodnaya-rybalka'
]
const homeRouteOffers = computed(() =>
  routeOrder.flatMap((slug) => {
    const offer = routeOffers.value.find((item) => item.slug === slug)
    return offer ? [offer] : []
  })
)
const openFaqIndex = ref<number | null>(0)

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const proofItems = computed(() => [
  {
    title: locale.value === 'en' ? 'Official operator' : locale.value === 'zh' ? '正规运营' : 'Лицензированная деятельность',
    text: locale.value === 'en' ? 'We work officially: Individual Entrepreneur A. G. Khavilov.' : locale.value === 'zh' ? '正规经营：个体经营者 A. G. Khavilov。' : 'Работаем официально: ИП Хавилов А. Г.'
  },
  {
    title: locale.value === 'en' ? 'Guests are insured' : locale.value === 'zh' ? '客人已投保' : 'Гости застрахованы',
    text: locale.value === 'en' ? 'All passengers and crew members are insured.' : locale.value === 'zh' ? '所有乘客和船员均已投保。' : 'Все пассажиры и члены экипажа застрахованы.'
  },
  {
    title: locale.value === 'en' ? 'Weather-led route' : locale.value === 'zh' ? '路线按天气调整' : 'Маршрут по погоде',
    text: locale.value === 'en' ? 'If conditions change, we discuss a transfer or calm adjustment of the program in advance.' : locale.value === 'zh' ? '如果条件变化，我们会提前沟通改期或平稳调整行程。' : 'Если условия меняются, заранее обсуждаем перенос или спокойную корректировку программы.'
  },
  {
    title: locale.value === 'en' ? 'Direct contact' : locale.value === 'zh' ? '直接联系' : 'Контакт напрямую',
    text: locale.value === 'en' ? 'No intermediaries: we quickly confirm the date, format, group size and trip details.' : locale.value === 'zh' ? '没有中间商：快速确认日期、形式、团队人数和出海细节。' : 'Без посредников: быстро уточняем дату, формат, состав группы и детали выхода.'
  }
])
</script>

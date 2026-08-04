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
          <div class="route-grid">
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

      <section v-if="locale === 'ru'" class="section route-extra-section seo-link-section" aria-labelledby="planning-links-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Перед бронированием</p>
            <h2 id="planning-links-title">Что полезно открыть до выхода в море</h2>
            <p class="hub-section-copy">Собрали страницы, которые помогают выбрать старт из Петропавловска-Камчатского, заранее понять условия на воде и не потерять полезные материалы перед поездкой.</p>
          </div>
          <div class="route-extra-grid">
            <NuxtLink v-for="link in ruPlanningLinks" :key="link.path" class="detail-panel detail-panel-link" :to="link.path">
                <span>{{ link.eyebrow }}</span>
                <strong>{{ link.title }}</strong>
                <p>{{ link.text }}</p>
            </NuxtLink>
            <ContactButton
              presentation="panel"
              eyebrow="Связь"
              label="Как забронировать"
              description="Позвоните по номеру +7 (914) 782-64-46. Уточним наличие мест, погодные условия, ограничения и подходящий формат выхода."
              context="Бронирование с главной страницы"
            />
          </div>
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

      <section class="section max-channel" aria-labelledby="max-channel-title">
        <div class="container">
          <div class="max-channel-panel">
            <div class="max-channel-mark" aria-hidden="true">
              <img :src="assetPath('/images/max-logo.svg')" width="56" height="56" alt="">
            </div>
            <div class="max-channel-copy">
              <p class="eyebrow">{{ text.home.maxChannelEyebrow }}</p>
              <h2 id="max-channel-title">{{ text.home.maxChannelTitle }}</h2>
              <p>{{ text.home.maxChannelText }}</p>
            </div>
            <a
              class="btn btn-primary max-channel-link"
              :href="business.maxChannelHref"
              target="_blank"
              rel="noopener"
            >
              {{ text.home.maxChannelButton }}
            </a>
          </div>
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
          <LazyReviewSlider :reviews="reviews" :label="text.home.reviewsAria" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const assetPath = useAssetPath()
const { locale, text, localePath } = useLocaleContent()
const { routeOffers, faqItems } = useRouteContent()
const { reviews, tourPhotos } = useSocialProof()

useAnturSeo({
  title: text.value.home.seoTitle,
  description: text.value.home.seoDescription
})
useBusinessSchema()
useFaqSchema()

const showFreshPhotos = true
const routeOrder = [
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
    text: locale.value === 'en' ? 'The captain makes the final decision one day before departure and we notify guests of any change.' : locale.value === 'zh' ? '船长会在出发前一天作出最终决定，并通知客人任何变更。' : 'Капитан принимает окончательное решение за сутки до выхода. Об изменениях сообщаем гостям накануне.'
  },
  {
    title: locale.value === 'en' ? 'Direct contact' : locale.value === 'zh' ? '直接联系' : 'Контакт напрямую',
    text: locale.value === 'en' ? 'No intermediaries: we quickly confirm the date, format, group size and trip details.' : locale.value === 'zh' ? '没有中间商：快速确认日期、形式、团队人数和出海细节。' : 'Без посредников: быстро уточняем дату, формат, состав группы и детали выхода.'
  }
])
const ruPlanningLinks = [
  {
    path: '/bezopasnost-na-more/',
    eyebrow: 'Важно',
    title: 'Безопасность на море',
    text: 'Погодные ограничения, решение капитана, дети на борту, страховка гостей и что взять с собой перед выходом.'
  },
  {
    path: '/guides/',
    eyebrow: 'Гайды',
    title: 'Гайды и советы перед выходом в море',
    text: 'Отдельный хаб с практичными материалами: сезон, укачивание, вещи на борт, дети, косатки и выбор рыбалки.'
  },
  {
    path: '/o-kompanii/',
    eyebrow: 'Антур',
    title: 'О компании',
    text: 'Кто организует выходы, как выглядит публичная структура маршрутов и на каких страницах смотреть свежий контент сезона.'
  }
] as const
</script>

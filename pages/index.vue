<template>
  <div>
    <HeroSection />

    <div class="landing-flow landing-flow-primary">
      <section id="routes" class="section routes" aria-labelledby="routes-title">
        <div class="container">
          <div class="section-heading">
            <p class="eyebrow">Маршруты и цены</p>
            <h2 id="routes-title">Выберите формат выхода</h2>
          </div>
          <div class="route-grid">
            <RouteCard v-for="offer in homeRouteOffers" :key="offer.slug" :offer="offer" />
          </div>
        </div>
      </section>

      <section class="section intro" aria-labelledby="intro-title">
        <div class="container intro-grid">
          <div>
            <p class="eyebrow">Камчатка с воды</p>
            <h2 id="intro-title">Море, вулканы и маршруты с характером</h2>
            <p>Подберем формат под вашу компанию: короткая прогулка по бухте, рыбалка в океане, выход к острову Старичков или длинный день с Бухтой Русской, крабом и остановками на берегу.</p>
          </div>
          <figure class="section-photo intro-photo">
            <img :src="assetPath('/images/kamchatka-ocean-rocks.jpg')" width="1400" height="788" loading="lazy" alt="Скалы Камчатки со стороны океана">
            <figcaption>Маршрут подтверждаем накануне выхода с учетом погоды и состояния акватории.</figcaption>
          </figure>
        </div>
      </section>

      <section v-if="showFreshPhotos" class="section gallery" aria-labelledby="gallery-title">
        <div class="container gallery-grid">
          <div class="gallery-copy">
            <p class="eyebrow">Свежие фото</p>
            <h2 id="gallery-title">Океан, краб, рыбалка и Камчатка в одном дне</h2>
            <p>Фото вынесены в отдельный контентный слой. Сейчас они берутся из локальных данных, дальше этот слой можно заменить на CMS или storage/CDN без изменения верстки.</p>
            <NuxtLink class="card-link dark-link" to="/gallery">Смотреть галерею</NuxtLink>
          </div>
          <div class="photo-stack" aria-label="Фотографии тура">
            <img v-for="photo in tourPhotos.slice(0, 2)" :key="photo.id" :src="assetPath(photo.src)" width="900" height="900" loading="lazy" :alt="photo.alt">
          </div>
        </div>
      </section>

      <section id="safety" class="section safety" aria-labelledby="safety-title">
        <div class="container safety-grid">
          <div class="safety-copy">
          <p class="eyebrow">Почему спокойно</p>
          <h2 id="safety-title">Маршрут ведет капитан, а не расписание</h2>
          <p>Камчатское море быстро меняется, поэтому программа всегда сверяется с прогнозом, состоянием акватории и составом группы. Если условия требуют корректировки, обсуждаем это заранее.</p>
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
            <p class="eyebrow">Бронирование</p>
            <h2 id="booking-title">Подберем дату и формат выхода</h2>
            <p>Напишите или позвоните: уточним маршрут, сезонную цену, состав группы и прогноз. Для бронирования места нужна предоплата 1 000 ₽.</p>
            <div class="booking-actions">
              <ContactButton label="Записаться" context="Бронирование морской прогулки" />
            </div>
          </div>
          <img class="booking-image" :src="assetPath('/images/crab-tasting.jpg')" width="900" height="675" loading="lazy" alt="Крабовая дегустация на борту">
        </div>
      </section>
    </div>

    <div class="landing-flow landing-flow-qa">
      <section id="faq" class="section faq" aria-labelledby="faq-title">
        <div class="container faq-grid">
          <div>
            <p class="eyebrow">Часто задаваемые вопросы</p>
            <h2 id="faq-title">Перед выходом в море</h2>
            <figure class="section-photo faq-photo">
              <img :src="assetPath('/images/hero-kamchatka-boat.jpg')" width="1300" height="743" loading="lazy" alt="Катер на фоне вулканов Камчатки">
            </figure>
          </div>
          <div class="faq-list">
            <div v-for="(item, index) in faq" :key="item.question" class="faq-item">
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
              <p class="eyebrow">Отзывы</p>
              <h2 id="reviews-title">Отзывы гостей</h2>
            </div>
          </div>
          <div class="reviews-layout">
            <div class="reviews-slider-shell">
              <button class="slider-arrow slider-arrow-left" type="button" aria-label="Предыдущие отзывы" @click="scrollReview(-1)">‹</button>
              <div
                ref="reviewsViewport"
                class="reviews-slider"
                :class="{ dragging: reviewDrag.active }"
                aria-label="Отзывы гостей"
                @pointerdown="startReviewDrag"
                @pointermove="moveReviewDrag"
                @pointerup="stopReviewDrag"
                @pointercancel="stopReviewDrag"
                @pointerleave="stopReviewDrag"
              >
                <article v-for="review in reviews" :key="review.id" class="review-slide">
                  <div class="rating" :aria-label="`${review.rating} из 5`">{{ '★'.repeat(review.rating) }}</div>
                  <p>{{ review.text }}</p>
                  <footer>
                    <strong>{{ review.name }}</strong>
                    <span>{{ review.route }}</span>
                  </footer>
                </article>
              </div>
              <button class="slider-arrow slider-arrow-right" type="button" aria-label="Следующие отзывы" @click="scrollReview(1)">›</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { routeOffers } from '~/data/routes'
import { business, faq } from '~/data/site'
import { reviews, tourPhotos } from '~/data/social-proof'

useAnturSeo({
  title: 'Морские прогулки и рыбалка на Камчатке | Антур',
  description: 'Морские прогулки, глубоководная рыбалка, Бухта Русская, остров Старичков и крабовое сафари из Петропавловска-Камчатского. Официальная деятельность, гости застрахованы.'
})
useBusinessSchema()
useFaqSchema()

const showFreshPhotos = false
const assetPath = useAssetPath()
const routeOrder = [
  'avachinskaya-buhta',
  'ostrov-starichkov',
  'buhta-russkaya',
  'rybalka',
  'glubokovodnaya-rybalka'
]
const homeRouteOffers = routeOrder
  .flatMap((slug) => {
    const offer = routeOffers.find((item) => item.slug === slug)
    return offer ? [offer] : []
  })
const reviewsViewport = ref<HTMLElement | null>(null)
const openFaqIndex = ref<number | null>(0)
const reviewDrag = reactive({
  active: false,
  startX: 0,
  scrollLeft: 0
})

const scrollReview = (direction: -1 | 1) => {
  const viewport = reviewsViewport.value

  if (!viewport) {
    return
  }

  const maxScroll = viewport.scrollWidth - viewport.clientWidth
  const pageStep = Math.max(viewport.clientWidth - 48, 280)
  const isAtEnd = viewport.scrollLeft >= maxScroll - 8
  const isAtStart = viewport.scrollLeft <= 8

  if (direction > 0 && isAtEnd) {
    viewport.scrollTo({ left: 0, behavior: 'smooth' })
    return
  }

  if (direction < 0 && isAtStart) {
    viewport.scrollTo({ left: maxScroll, behavior: 'smooth' })
    return
  }

  viewport.scrollBy({ left: pageStep * direction, behavior: 'smooth' })
}

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const startReviewDrag = (event: PointerEvent) => {
  const viewport = reviewsViewport.value

  if (!viewport) {
    return
  }

  reviewDrag.active = true
  reviewDrag.startX = event.clientX
  reviewDrag.scrollLeft = viewport.scrollLeft
  viewport.setPointerCapture(event.pointerId)
}

const moveReviewDrag = (event: PointerEvent) => {
  const viewport = reviewsViewport.value

  if (!viewport || !reviewDrag.active) {
    return
  }

  viewport.scrollLeft = reviewDrag.scrollLeft - (event.clientX - reviewDrag.startX)
}

const stopReviewDrag = (event: PointerEvent) => {
  const viewport = reviewsViewport.value
  reviewDrag.active = false

  if (viewport?.hasPointerCapture(event.pointerId)) {
    viewport.releasePointerCapture(event.pointerId)
  }
}

const proofItems = [
  {
    title: 'Лицензированная деятельность',
    text: 'Работаем официально: ИП Хавилов А. Г.'
  },
  {
    title: 'Гости застрахованы',
    text: 'Все пассажиры и члены экипажа застрахованы.'
  },
  {
    title: 'Маршрут по погоде',
    text: 'Если условия меняются, заранее обсуждаем перенос или спокойную корректировку программы.'
  },
  {
    title: 'Контакт напрямую',
    text: 'Без посредников: быстро уточняем дату, формат, состав группы и детали выхода.'
  }
]
</script>

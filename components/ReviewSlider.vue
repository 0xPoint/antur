<template>
  <div class="reviews-layout">
    <div class="reviews-slider-shell">
      <button class="slider-arrow slider-arrow-left" type="button" :aria-label="text.home.prevReviews" @click="scrollByPage(-1)">‹</button>
      <div
        ref="viewport"
        class="reviews-slider"
        :class="{ dragging: drag.active }"
        role="region"
        :aria-label="label"
        tabindex="0"
        @pointerdown="startDrag"
        @pointermove="moveDrag"
        @pointerup="stopDrag"
        @pointercancel="stopDrag"
        @pointerleave="stopDrag"
        @click.capture="preventClickAfterDrag"
      >
        <article v-for="review in reviews" :key="review.id" class="review-slide">
          <div class="rating" :aria-label="text.home.ratingLabel(review.rating)">{{ '★'.repeat(review.rating) }}</div>
          <ReviewExcerpt
            :text="review.text"
            :source-url="review.sourceUrl"
            :original-label="text.home.reviewOriginalLink"
            :more-label="text.home.reviewMoreLink"
            :collapse-label="text.home.reviewCollapseLink"
          />
          <footer>
            <strong>{{ review.name }}</strong>
            <span>
              <NuxtLink
                v-if="linkRoutes && review.routeSlug"
                :to="localePath(`/routes/${review.routeSlug}`)"
                @pointerdown.stop
                @click.stop
              >{{ review.route }}</NuxtLink>
              <template v-else>{{ review.route }}</template>
            </span>
            <span>
              <time :datetime="review.date">{{ formatDate(review.date) }}</time>
              <template v-if="review.sourceUrl && review.source">
                · <a
                  :href="review.sourceUrl"
                  target="_blank"
                  rel="noopener nofollow"
                  @pointerdown.stop
                  @click="openExternalPopup($event, review.sourceUrl)"
                >{{ review.source }}</a>
              </template>
              <template v-else-if="review.source"> · {{ review.source }}</template>
            </span>
          </footer>
        </article>
      </div>
      <button class="slider-arrow slider-arrow-right" type="button" :aria-label="text.home.nextReviews" @click="scrollByPage(1)">›</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Review } from '~/types/content'

withDefaults(defineProps<{
  reviews: Review[]
  label: string
  linkRoutes?: boolean
}>(), {
  linkRoutes: true
})

const { text, localePath } = useLocaleContent()
const { openExternalPopup } = useExternalPopup()
const { viewport, drag, scrollByPage, startDrag, moveDrag, stopDrag, preventClickAfterDrag } = useDragSlider()

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(text.value.gallery.dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00`))
</script>

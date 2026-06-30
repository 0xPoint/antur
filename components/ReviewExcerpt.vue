<template>
  <p class="review-text">
    {{ excerpt }}
    <template v-if="isTruncated && sourceUrl">
      <a
        class="review-original-link"
        :href="sourceUrl"
        target="_blank"
        rel="noopener nofollow"
        @pointerdown.stop
        @click="openExternalPopup($event, sourceUrl)"
      >{{ originalLabel }}</a>
    </template>
    <template v-else-if="isTruncated">
      <button
        class="review-original-link review-original-button"
        type="button"
        @pointerdown.stop
        @click.stop="expanded = true"
      >{{ moreLabel }}</button>
    </template>
    <template v-else-if="canToggle">
      <button
        class="review-original-link review-original-button"
        type="button"
        @pointerdown.stop
        @click.stop="expanded = false"
      >{{ collapseLabel }}</button>
    </template>
  </p>
</template>

<script setup lang="ts">
import {
  getReviewExcerpt,
  REVIEW_EXCERPT_MAX_LENGTH,
  REVIEW_EXCERPT_TRUNCATION_SLACK,
  shouldTruncateReviewText
} from '~/utils/review-excerpt'

const { openExternalPopup } = useExternalPopup()

const props = withDefaults(defineProps<{
  text: string
  sourceUrl?: string
  originalLabel: string
  moreLabel: string
  collapseLabel: string
  maxLength?: number
  truncationSlack?: number
}>(), {
  maxLength: REVIEW_EXCERPT_MAX_LENGTH,
  truncationSlack: REVIEW_EXCERPT_TRUNCATION_SLACK
})

const expanded = ref(false)
const excerptOptions = computed(() => ({
  maxLength: props.maxLength,
  truncationSlack: props.truncationSlack,
  expanded: expanded.value
}))

const collapsedExcerptOptions = computed(() => ({
  maxLength: props.maxLength,
  truncationSlack: props.truncationSlack,
  expanded: false
}))

const canToggle = computed(() => !props.sourceUrl && shouldTruncateReviewText(props.text, collapsedExcerptOptions.value))
const isTruncated = computed(() => shouldTruncateReviewText(props.text, excerptOptions.value))
const excerpt = computed(() => getReviewExcerpt(props.text, excerptOptions.value))
</script>

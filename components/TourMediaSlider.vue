<template>
  <div class="media-slider" aria-roledescription="carousel">
    <div class="media-slider-frame">
      <button
        class="media-nav media-nav-prev"
        type="button"
        :aria-label="labels.previous"
        @click="showPrevious"
      >
        ‹
      </button>

      <div
        class="media-slide"
        :key="currentItem.id"
        :class="{ dragging: dragState.active }"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @lostpointercapture="handlePointerCancel"
      >
        <button
          v-if="currentItem.kind !== 'video'"
          class="media-open"
          type="button"
          :aria-label="labels.open"
          @click="handleMediaOpen"
          @dragstart.prevent
        >
          <OptimizedImage
            :src="currentItem.src"
            width="1200"
            height="900"
            sizes="(max-width: 760px) 92vw, 44vw"
            :widths="[480, 720, 960]"
            loading="lazy"
            :alt="currentItem.alt"
          />
          <span class="media-expand" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M8 3H3v5" />
              <path d="M16 3h5v5" />
              <path d="M21 16v5h-5" />
              <path d="M3 16v5h5" />
            </svg>
          </span>
        </button>

        <div v-else class="media-video-wrap">
          <video
            ref="mainVideo"
            controls
            playsinline
            preload="metadata"
            :poster="currentItem.posterSrc ? assetPath(currentItem.posterSrc) : undefined"
            :aria-label="currentItem.alt"
            @play="mainVideoIsPlaying = true"
            @pause="mainVideoIsPlaying = false"
            @ended="mainVideoIsPlaying = false"
          >
            <source :src="assetPath(currentItem.videoSrc || currentItem.src)" type="video/mp4">
          </video>
          <button class="media-expand media-expand-video" type="button" :aria-label="labels.open" @click="openLightbox(currentIndex)">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M8 3H3v5" />
              <path d="M16 3h5v5" />
              <path d="M21 16v5h-5" />
              <path d="M3 16v5h5" />
            </svg>
          </button>
        </div>

        <p class="media-slide-caption">
          <strong>{{ currentItem.route }}</strong>
          <span>{{ currentItem.caption || currentItem.alt }}</span>
          <time :datetime="currentItem.date">{{ currentItem.date }}</time>
        </p>

      </div>

      <button
        class="media-nav media-nav-next"
        type="button"
        :aria-label="labels.next"
        @click="showNext"
      >
        ›
      </button>
    </div>

    <div class="media-dots" aria-hidden="true">
      <button
        v-for="(item, index) in items"
        :key="item.id"
        class="media-dot"
        :class="{ active: index === currentIndex }"
        type="button"
        tabindex="-1"
        @click="showSlide(index)"
      />
    </div>

    <Teleport to="body">
      <div v-if="lightboxIndex !== null" class="media-lightbox" role="dialog" aria-modal="true" :aria-label="labels.open">
        <button class="media-lightbox-close" type="button" :aria-label="labels.close" @click="closeLightbox">×</button>
        <button class="media-lightbox-nav media-lightbox-prev" type="button" :aria-label="labels.previous" @click="showLightboxPrevious">‹</button>

        <figure
          class="media-lightbox-figure"
          :key="lightboxItem.id"
          :class="{ dragging: lightboxDragState.active }"
          @pointerdown="handleLightboxPointerDown"
          @pointermove="handleLightboxPointerMove"
          @pointerup="handleLightboxPointerUp"
          @pointercancel="handleLightboxPointerCancel"
          @lostpointercapture="handleLightboxPointerCancel"
        >
          <video
            v-if="lightboxItem.kind === 'video'"
            controls
            playsinline
            preload="metadata"
            :poster="lightboxItem.posterSrc ? assetPath(lightboxItem.posterSrc) : undefined"
            :aria-label="lightboxItem.alt"
          >
            <source :src="assetPath(lightboxItem.videoSrc || lightboxItem.src)" type="video/mp4">
          </video>
          <img v-else :src="assetPath(lightboxItem.src)" :alt="lightboxItem.alt">
          <figcaption>
            <span>{{ lightboxItem.caption || lightboxItem.alt }}</span>
            <time :datetime="lightboxItem.date">{{ lightboxItem.date }}</time>
          </figcaption>
        </figure>

        <button class="media-lightbox-nav media-lightbox-next" type="button" :aria-label="labels.next" @click="showLightboxNext">›</button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { TourPhoto } from '~/types/content'

const props = defineProps<{
  items: TourPhoto[]
  labels: {
    previous: string
    next: string
    open: string
    close: string
  }
}>()

const assetPath = useAssetPath()
const currentIndex = ref(0)
const lightboxIndex = ref<number | null>(null)
const mainVideo = ref<HTMLVideoElement | null>(null)
const mainVideoIsPlaying = ref(false)
const dragState = reactive({
  active: false,
  pointerId: 0,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,
  swiped: false
})
const lightboxDragState = reactive({
  active: false,
  pointerId: 0,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0
})

const currentItem = computed(() => props.items[currentIndex.value])
const lightboxItem = computed(() => props.items[lightboxIndex.value ?? currentIndex.value])

const normalizeIndex = (index: number) => {
  if (!props.items.length) {
    return 0
  }

  return (index + props.items.length) % props.items.length
}

const showPrevious = () => {
  pauseMainVideo()
  currentIndex.value = normalizeIndex(currentIndex.value - 1)
}

const showNext = () => {
  pauseMainVideo()
  currentIndex.value = normalizeIndex(currentIndex.value + 1)
}

const showSlide = (index: number) => {
  pauseMainVideo()
  currentIndex.value = normalizeIndex(index)
}

const openLightbox = (index: number) => {
  pauseMainVideo()
  lightboxIndex.value = normalizeIndex(index)
}

const handleMediaOpen = (event: MouseEvent) => {
  if (dragState.swiped) {
    event.preventDefault()
    event.stopPropagation()
    dragState.swiped = false
    return
  }

  openLightbox(currentIndex.value)
}

const handlePointerDown = (event: PointerEvent) => {
  if ((event.target as HTMLElement).closest('video, .media-expand')) {
    return
  }

  dragState.active = true
  dragState.pointerId = event.pointerId
  dragState.startX = event.clientX
  dragState.startY = event.clientY
  dragState.deltaX = 0
  dragState.deltaY = 0
  dragState.swiped = false
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const handlePointerMove = (event: PointerEvent) => {
  if (!dragState.active || event.pointerId !== dragState.pointerId) {
    return
  }

  dragState.deltaX = event.clientX - dragState.startX
  dragState.deltaY = event.clientY - dragState.startY
}

const handlePointerUp = (event: PointerEvent) => {
  if (!dragState.active || event.pointerId !== dragState.pointerId) {
    return
  }

  const absX = Math.abs(dragState.deltaX)
  const absY = Math.abs(dragState.deltaY)
  const isHorizontalSwipe = absX > 48 && absX > absY * 1.4

  dragState.active = false

  if (!isHorizontalSwipe) {
    return
  }

  dragState.swiped = true

  if (dragState.deltaX < 0) {
    showNext()
  } else {
    showPrevious()
  }
}

const handlePointerCancel = () => {
  dragState.active = false
}

const handleLightboxPointerDown = (event: PointerEvent) => {
  if ((event.target as HTMLElement).closest('video, .media-lightbox-nav, .media-lightbox-close')) {
    return
  }

  lightboxDragState.active = true
  lightboxDragState.pointerId = event.pointerId
  lightboxDragState.startX = event.clientX
  lightboxDragState.startY = event.clientY
  lightboxDragState.deltaX = 0
  lightboxDragState.deltaY = 0
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

const handleLightboxPointerMove = (event: PointerEvent) => {
  if (!lightboxDragState.active || event.pointerId !== lightboxDragState.pointerId) {
    return
  }

  lightboxDragState.deltaX = event.clientX - lightboxDragState.startX
  lightboxDragState.deltaY = event.clientY - lightboxDragState.startY
}

const handleLightboxPointerUp = (event: PointerEvent) => {
  if (!lightboxDragState.active || event.pointerId !== lightboxDragState.pointerId) {
    return
  }

  const absX = Math.abs(lightboxDragState.deltaX)
  const absY = Math.abs(lightboxDragState.deltaY)
  const isHorizontalSwipe = absX > 48 && absX > absY * 1.4

  lightboxDragState.active = false

  if (!isHorizontalSwipe) {
    return
  }

  if (lightboxDragState.deltaX < 0) {
    showLightboxNext()
  } else {
    showLightboxPrevious()
  }
}

const handleLightboxPointerCancel = () => {
  lightboxDragState.active = false
}

const pauseMainVideo = () => {
  mainVideo.value?.pause()
  mainVideoIsPlaying.value = false
}

const closeLightbox = () => {
  lightboxIndex.value = null
}

const showLightboxPrevious = () => {
  lightboxIndex.value = normalizeIndex((lightboxIndex.value ?? currentIndex.value) - 1)
}

const showLightboxNext = () => {
  lightboxIndex.value = normalizeIndex((lightboxIndex.value ?? currentIndex.value) + 1)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (lightboxIndex.value === null) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
  }

  if (event.key === 'ArrowLeft') {
    showLightboxPrevious()
  }

  if (event.key === 'ArrowRight') {
    showLightboxNext()
  }
}

watch(lightboxIndex, (index) => {
  if (!import.meta.client) {
    return
  }

  document.body.classList.toggle('modal-open', index !== null)
})

watch(currentIndex, () => {
  mainVideoIsPlaying.value = false
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)

  if (import.meta.client) {
    document.body.classList.remove('modal-open')
  }
})
</script>

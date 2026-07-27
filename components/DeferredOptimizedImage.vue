<template>
  <OptimizedImage
    v-if="shouldLoad"
    v-bind="imageProps"
    :class="$attrs.class"
  />
  <span
    v-else
    ref="placeholder"
    class="deferred-image-placeholder"
    :class="$attrs.class"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  src: string
  alt: string
  width: number | string
  height: number | string
  sizes?: string
  widths?: number[]
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
  rootMargin?: string
}>(), {
  sizes: '100vw',
  widths: () => [480, 640, 720, 960, 1280],
  loading: 'lazy',
  fetchpriority: undefined,
  decoding: 'async',
  rootMargin: '180px'
})

const placeholder = ref<HTMLElement | null>(null)
const shouldLoad = ref(false)
let observer: IntersectionObserver | undefined

const imageProps = computed(() => {
  const { rootMargin: _rootMargin, ...rest } = props
  return rest
})

onMounted(() => {
  if (!placeholder.value || !('IntersectionObserver' in window)) {
    shouldLoad.value = true
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) {
      return
    }

    shouldLoad.value = true
    observer?.disconnect()
  }, {
    rootMargin: props.rootMargin
  })

  observer.observe(placeholder.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

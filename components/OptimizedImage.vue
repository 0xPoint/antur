<template>
  <picture class="optimized-picture">
    <source
      v-if="mobileSrc"
      type="image/webp"
      :media="mobileMedia"
      :srcset="webpSrcset(mobileSrc, mobileWidths)"
      :sizes="sizes"
    >
    <source type="image/webp" :srcset="webpSrcset(src, widths)" :sizes="sizes">
    <source v-if="mobileSrc" :media="mobileMedia" :srcset="assetPath(mobileSrc)">
    <img
      v-bind="imgAttrs"
      :class="attrs.class"
      :src="assetPath(src)"
      :width="width"
      :height="height"
      :loading="loading"
      :fetchpriority="fetchpriority"
      :decoding="decoding"
      :alt="alt"
    >
  </picture>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  src: string
  mobileSrc?: string
  alt: string
  width: number | string
  height: number | string
  sizes?: string
  widths?: number[]
  mobileWidths?: number[]
  mobileMedia?: string
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
}>(), {
  sizes: '100vw',
  widths: () => [480, 640, 720, 960, 1280],
  mobileWidths: () => [480, 640, 720],
  mobileMedia: '(max-width: 680px)',
  loading: 'lazy',
  fetchpriority: undefined,
  decoding: 'async'
})

const attrs = useAttrs()
const { assetPath, webpSrcset } = useImageSources()

const imgAttrs = computed(() => {
  const { class: _class, ...rest } = attrs
  return rest
})

const { src, mobileSrc, alt, width, height, sizes, widths, mobileWidths, mobileMedia, loading, fetchpriority, decoding } = toRefs(props)
</script>

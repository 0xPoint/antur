<template>
  <picture class="optimized-picture">
    <source type="image/webp" :srcset="webpSrcset(src, widths)" :sizes="sizes">
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
  alt: string
  width: number | string
  height: number | string
  sizes?: string
  widths?: number[]
  loading?: 'lazy' | 'eager'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'async' | 'sync' | 'auto'
}>(), {
  sizes: '100vw',
  widths: () => [480, 720, 960, 1280],
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

const { src, alt, width, height, sizes, widths, loading, fetchpriority, decoding } = toRefs(props)
</script>

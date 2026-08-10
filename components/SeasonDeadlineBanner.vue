<template>
  <Transition name="season-banner">
    <aside
      v-if="isVisible"
      class="season-deadline-banner"
      :aria-label="text.seasonBanner.title"
    >
      <div class="season-deadline-accent" aria-hidden="true">
        <span>23</span>
        <small>{{ monthLabel }}</small>
      </div>

      <div class="season-deadline-copy">
        <p class="season-deadline-eyebrow">{{ text.seasonBanner.eyebrow }}</p>
        <strong>{{ text.seasonBanner.title }}</strong>
        <p>{{ text.seasonBanner.text }}</p>
      </div>

      <ContactButton
        class="season-deadline-contact"
        :label="text.seasonBanner.cta"
        :context="text.seasonBanner.context"
      />

      <button
        class="season-deadline-close"
        type="button"
        :aria-label="text.seasonBanner.close"
        @click="dismiss"
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
const storageKey = 'antur-season-deadline-2026-08-23'
const { locale, text } = useLocaleContent()
const isVisible = ref(true)

const monthLabel = computed(() => ({
  ru: 'авг',
  en: 'Aug',
  zh: '8 月'
})[locale.value])

const dismiss = () => {
  isVisible.value = false

  if (import.meta.client) {
    sessionStorage.setItem(storageKey, 'dismissed')
  }
}

onMounted(() => {
  isVisible.value = sessionStorage.getItem(storageKey) !== 'dismissed'
})
</script>

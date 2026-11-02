<template>
  <Transition name="season-banner">
    <aside
      v-if="isVisible"
      class="season-deadline-banner"
      :aria-label="season.title"
    >
      <div class="season-deadline-accent" aria-hidden="true">
        <span>{{ seasonPreparation.year }}</span>
      </div>

      <div class="season-deadline-copy">
        <p class="season-deadline-eyebrow">{{ season.label }}</p>
        <strong>{{ season.title }}</strong>
        <p>{{ season.conditions }}</p>
      </div>

      <ContactButton
        seasonal
        class="season-deadline-contact"
        :label="season.cta"
        :context="season.context"
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
const { season, seasonPreparation } = useSeasonContent()
const storageKey = `antur-season-preparation-${seasonPreparation.year}`
const { text } = useLocaleContent()
const isVisible = ref(true)

const dismiss = () => {
  isVisible.value = false

  if (import.meta.client) {
    try {
      sessionStorage.setItem(storageKey, 'dismissed')
    } catch {
      // Dismissal still works when browser storage is unavailable.
    }
  }
}

onMounted(() => {
  try {
    isVisible.value = sessionStorage.getItem(storageKey) !== 'dismissed'
  } catch {
    isVisible.value = true
  }
})
</script>

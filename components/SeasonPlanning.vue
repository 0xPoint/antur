<template>
  <section class="section season-planning" :class="{ 'season-planning-compact': compact }" :aria-labelledby="titleId">
    <div class="container">
      <div class="season-planning-heading">
        <div>
          <p class="eyebrow">{{ season.label }}</p>
          <h2 :id="titleId">{{ season.title }}</h2>
          <p v-if="!compact">{{ season.lead }}</p>
          <p class="season-conditions">{{ season.conditions }}</p>
        </div>
        <ContactButton seasonal :label="season.cta" :context="context || season.context" />
      </div>
      <template v-if="!compact">
        <ol class="season-planning-steps">
          <li v-for="step in season.steps" :key="step.title">
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </li>
        </ol>
        <div class="season-planning-links">
          <NuxtLink v-if="locale === 'ru'" class="card-link" to="/guides/">{{ season.guidesLink }}</NuxtLink>
          <NuxtLink class="card-link" :to="localePath('/gallery')">{{ season.archiveLink }}</NuxtLink>
        </div>
        <div class="season-planning-faq">
          <details v-for="item in season.faq" :key="item.question">
            <summary>{{ item.question }}</summary>
            <p>{{ item.answer }}</p>
          </details>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ compact?: boolean; context?: string }>()
const { season } = useSeasonContent()
const { locale, localePath } = useLocaleContent()
const titleId = useId()
</script>

<style scoped>
.season-planning { background: var(--ocean-900); border-block: 1px solid var(--card-border); }
.season-planning-heading { display: flex; align-items: center; justify-content: space-between; gap: 32px; }
.season-planning-heading > div:first-child { max-width: 700px; }
.season-planning h2 { margin: 0 0 16px; }
.season-conditions { color: var(--muted); margin-bottom: 0; }
.season-planning-heading :deep(.contact-widget) { flex-shrink: 0; max-width: 100%; }
.season-planning-heading :deep(.btn) { white-space: normal; text-align: center; }
.season-planning-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; margin: 32px 0 24px; padding-left: 24px; }
.season-planning-steps li { padding-left: 8px; }
.season-planning-steps li::marker { color: var(--gold); font-weight: 700; }
.season-planning-steps h3 { font-size: 19px; margin: 0 0 8px; }
.season-planning-steps p { color: var(--muted); margin: 0; }
.season-planning-links { display: flex; flex-wrap: wrap; gap: 16px 32px; }
.season-planning-faq { margin-top: 32px; border-top: 1px solid var(--card-border); }
.season-planning-faq details { border-bottom: 1px solid var(--card-border); padding: 16px 0; }
.season-planning-faq summary { cursor: pointer; font-weight: 600; }
.season-planning-faq p { max-width: 800px; margin: 12px 0 0; color: var(--muted); }
.season-planning-compact { padding-block: 32px; }
.season-planning-compact h2 { font-size: clamp(22px, 3vw, 30px); margin-bottom: 8px; }
@media (max-width: 900px) {
  .season-planning-heading { align-items: flex-start; flex-direction: column; gap: 24px; }
}
@media (max-width: 680px) {
  .season-planning-steps { grid-template-columns: 1fr; gap: 24px; }
  .season-planning-heading :deep(.contact-widget), .season-planning-heading :deep(.btn) { width: 100%; }
}
</style>

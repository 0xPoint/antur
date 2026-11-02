<template>
  <section class="section season-planning" :class="{ 'season-planning-compact': compact }" :aria-labelledby="titleId">
    <div class="container">
      <div class="season-planning-heading">
        <div class="season-planning-intro">
          <p class="eyebrow">{{ season.label }}</p>
          <h2 :id="titleId">{{ season.title }}</h2>
          <p v-if="!compact" class="season-planning-lead">{{ season.lead }}</p>
          <p v-else class="season-conditions">{{ season.conditions }}</p>
          <ContactButton seasonal :label="season.cta" :context="context || season.context" />
        </div>
        <figure v-if="!compact" class="season-planning-photo">
          <OptimizedImage
            src="/images/antur-kamchatka-boat-pier-2026-06-01.jpg"
            width="1200"
            height="1600"
            sizes="(max-width: 680px) 92vw, (max-width: 900px) 40vw, 35vw"
            :widths="[480, 720, 960]"
            loading="lazy"
            :alt="boatAlt"
          />
          <figcaption>{{ boatCaption }}</figcaption>
        </figure>
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
const boatAlt = computed(() => ({
  ru: 'Катер «Антур» у причала в Петропавловске-Камчатском',
  en: 'The Antur boat at the pier in Petropavlovsk-Kamchatsky',
  zh: '停靠在彼得罗巴甫洛夫斯克-堪察加码头的 Antur 船只'
})[locale.value])
const boatCaption = computed(() => ({
  ru: 'Катер «Антур» · 1 июня 2026',
  en: 'Antur boat · 1 June 2026',
  zh: 'Antur 船只 · 2026 年 6 月 1 日'
})[locale.value])
</script>

<style scoped>
.season-planning { padding-block: clamp(64px, 7vw, 96px); background: var(--ocean-900); border-block: 1px solid var(--card-border); }
.season-planning-heading { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 0.72fr); align-items: center; gap: clamp(32px, 6vw, 84px); }
.season-planning-intro { min-width: 0; max-width: 650px; }
.season-planning h2 { max-width: 18ch; margin: 0 0 20px; font-size: clamp(30px, 3.4vw, 44px); line-height: 1.08; }
.season-planning-lead, .season-conditions { max-width: 58ch; margin-bottom: 28px; color: var(--mist); font-size: clamp(16px, 1.3vw, 18px); line-height: 1.65; }
.season-conditions { color: var(--muted); }
.season-planning-intro :deep(.contact-widget) { max-width: 100%; }
.season-planning-intro :deep(.btn) { max-width: 100%; white-space: normal; text-align: center; }
.season-planning-photo { min-width: 0; margin: 0; }
.season-planning-photo :deep(picture) { overflow: hidden; border-radius: 12px; }
.season-planning-photo :deep(img) { width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; object-position: center 55%; }
.season-planning-photo figcaption { margin-top: 10px; color: var(--muted); font-size: 13px; }
.season-planning-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; margin: 56px 0 32px; padding: 0; list-style: none; counter-reset: season-step; }
.season-planning-steps li { min-width: 0; padding-top: 18px; border-top: 1px solid rgba(229, 185, 111, 0.45); counter-increment: season-step; }
.season-planning-steps li::before { display: block; margin-bottom: 12px; color: var(--gold); font-size: 13px; font-weight: 800; letter-spacing: 0.08em; content: counter(season-step, decimal-leading-zero); }
.season-planning-steps h3 { margin: 0 0 10px; font-size: 19px; }
.season-planning-steps p { margin: 0; color: var(--muted); line-height: 1.6; }
.season-planning-links { display: flex; flex-wrap: wrap; gap: 16px 32px; }
.season-planning-faq { margin-top: 40px; border-top: 1px solid var(--card-border); }
.season-planning-faq details { border-bottom: 1px solid var(--card-border); padding: 16px 0; }
.season-planning-faq summary { cursor: pointer; font-weight: 600; }
.season-planning-faq p { max-width: 800px; margin: 12px 0 0; color: var(--muted); }
.season-planning-compact { padding-block: 32px; }
.season-planning-compact .season-planning-heading { display: block; }
.season-planning-compact .season-planning-intro { max-width: 800px; }
.season-planning-compact h2 { max-width: none; margin-bottom: 8px; font-size: clamp(22px, 3vw, 30px); }
.season-planning-compact .season-conditions { margin-bottom: 18px; font-size: 16px; }
@media (max-width: 900px) {
  .season-planning-heading { grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr); gap: 28px; }
  .season-planning-steps { gap: 20px; }
}
@media (max-width: 680px) {
  .season-planning-heading { grid-template-columns: minmax(0, 1fr); gap: 32px; }
  .season-planning-intro :deep(.contact-widget), .season-planning-intro :deep(.btn) { width: 100%; }
  .season-planning-photo :deep(img) { aspect-ratio: 16 / 10; }
  .season-planning-steps { grid-template-columns: minmax(0, 1fr); gap: 24px; margin-top: 40px; }
  .season-planning-faq { margin-top: 32px; }
}
</style>

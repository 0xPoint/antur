<template>
  <section class="section season-planning" :class="{ 'season-planning-compact': compact }" :aria-labelledby="titleId">
    <div class="container">
      <div class="season-planning-heading">
        <figure v-if="!compact" class="season-planning-photo">
          <OptimizedImage
            src="/images/antur-kamchatka-kekury-boat-2026-07-29.jpg"
            width="1600"
            height="1200"
            sizes="(max-width: 680px) 100vw, 1180px"
            :widths="[480, 720, 960]"
            loading="lazy"
            :alt="boatAlt"
          />
          <figcaption>{{ boatCaption }}</figcaption>
        </figure>
        <div class="season-planning-intro">
          <p class="eyebrow">{{ season.label }}</p>
          <h2 :id="titleId">{{ season.title }}</h2>
          <p v-if="!compact" class="season-planning-lead">{{ season.lead }}</p>
          <p v-else class="season-conditions">{{ season.conditions }}</p>
          <ContactButton seasonal :label="season.cta" :context="context || season.context" />
        </div>
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
  ru: 'Морская прогулка к прибрежным скалам Камчатки',
  en: 'A sea trip to the coastal cliffs of Kamchatka',
  zh: '乘船前往堪察加海岸的岩石'
})[locale.value])
const boatCaption = computed(() => ({
  ru: 'Камчатка с воды · 29 июля 2026',
  en: 'Kamchatka from the water · 29 July 2026',
  zh: '海上的堪察加 · 2026 年 7 月 29 日'
})[locale.value])
</script>

<style scoped>
.season-planning { padding-block: clamp(68px, 8vw, 112px); background: var(--ocean-950); }
.season-planning-heading { position: relative; isolation: isolate; overflow: hidden; min-height: 480px; display: flex; align-items: center; border-radius: 16px; background: #102c40; }
.season-planning-photo { position: absolute; z-index: -2; inset: 0; margin: 0; }
.season-planning-photo::after { position: absolute; inset: 0; content: ''; background: linear-gradient(90deg, rgba(4, 19, 30, .96) 0%, rgba(4, 19, 30, .84) 36%, rgba(4, 19, 30, .22) 78%), linear-gradient(0deg, rgba(4, 19, 30, .35), transparent 45%); }
.season-planning-photo :deep(picture), .season-planning-photo :deep(img) { width: 100%; height: 100%; }
.season-planning-photo :deep(img) { object-fit: cover; object-position: center 60%; }
.season-planning-photo figcaption { position: absolute; z-index: 1; right: 24px; bottom: 20px; color: rgba(255,255,255,.85); font-size: 12px; text-shadow: 0 1px 8px #000; }
.season-planning-intro { width: min(100%, 700px); padding: clamp(34px, 5vw, 70px); }
.season-planning-intro .eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 26px; }
.season-planning-intro .eyebrow::before { width: 28px; height: 2px; background: var(--gold); content: ''; }
.season-planning h2 { max-width: 15ch; margin: 0 0 22px; font-size: clamp(34px, 4.4vw, 58px); line-height: 1.04; letter-spacing: -.025em; }
.season-planning-lead, .season-conditions { max-width: 48ch; margin-bottom: 30px; color: var(--mist); font-size: clamp(16px, 1.4vw, 18px); line-height: 1.65; }
.season-conditions { color: var(--muted); }
.season-planning-intro :deep(.contact-widget) { max-width: 100%; }
.season-planning-intro :deep(.btn) { max-width: 100%; white-space: normal; text-align: center; }
.season-planning-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; margin: 0; padding: 30px 0 28px; list-style: none; border-bottom: 1px solid rgba(255, 255, 255, .14); counter-reset: season-step; }
.season-planning-steps li { display: grid; grid-template-columns: 32px minmax(0, 1fr); align-content: start; column-gap: 14px; min-width: 0; padding: 0 28px; border-left: 1px solid rgba(255, 255, 255, .14); counter-increment: season-step; }
.season-planning-steps li:first-child { padding-left: 0; border-left: 0; }
.season-planning-steps li:last-child { padding-right: 0; }
.season-planning-steps li::before { grid-row: span 2; color: var(--gold); font-size: 13px; line-height: 1.6; font-weight: 800; content: counter(season-step, decimal-leading-zero); }
.season-planning-steps h3 { margin: 0 0 8px; font-size: 17px; }
.season-planning-steps p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.6; }
.season-planning-links { display: flex; flex-wrap: wrap; gap: 16px 32px; margin-top: 28px; }
.season-planning-faq { margin-top: 36px; border-top: 1px solid var(--card-border); }
.season-planning-faq details { border-bottom: 1px solid var(--card-border); padding: 16px 0; }
.season-planning-faq summary { cursor: pointer; font-weight: 600; }
.season-planning-faq p { max-width: 800px; margin: 12px 0 0; color: var(--muted); }
.season-planning-compact { padding-block: 32px; border-block: 1px solid var(--card-border); background: var(--ocean-900); }
.season-planning-compact .season-planning-heading { min-height: 0; overflow: visible; border-radius: 0; background: transparent; }
.season-planning-compact .season-planning-intro { width: 100%; max-width: 800px; padding: 0; }
.season-planning-compact .season-planning-intro .eyebrow { margin-bottom: 8px; }
.season-planning-compact h2 { max-width: none; margin-bottom: 8px; font-size: clamp(22px, 3vw, 30px); }
.season-planning-compact .season-conditions { margin-bottom: 18px; font-size: 16px; }
@media (max-width: 900px) {
  .season-planning-steps li { padding-inline: 16px; grid-template-columns: 26px minmax(0, 1fr); gap: 8px; }
  .season-planning-photo::after { background: linear-gradient(90deg, rgba(4, 19, 30, .95), rgba(4, 19, 30, .56) 70%, rgba(4, 19, 30, .3)); }
}
@media (max-width: 680px) {
  .season-planning-heading { min-height: 540px; align-items: flex-end; }
  .season-planning-intro { padding: 36px 24px 48px; }
  .season-planning h2 { max-width: 14ch; }
  .season-planning-photo :deep(img) { object-position: 62% center; }
  .season-planning-photo::after { background: linear-gradient(0deg, rgba(4, 19, 30, .96) 0%, rgba(4, 19, 30, .82) 47%, rgba(4, 19, 30, .08) 100%); }
  .season-planning-photo figcaption { top: 16px; bottom: auto; right: 16px; }
  .season-planning-intro :deep(.contact-widget), .season-planning-intro :deep(.btn) { width: 100%; }
  .season-planning-steps { grid-template-columns: minmax(0, 1fr); gap: 20px; padding-block: 28px; }
  .season-planning-steps li, .season-planning-steps li:first-child, .season-planning-steps li:last-child { padding: 0; border-left: 0; }
  .season-planning-faq { margin-top: 32px; }
  .season-planning-compact .season-planning-heading { min-height: 0; }
}
</style>

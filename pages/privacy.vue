<template>
  <section class="section page-top legal" aria-labelledby="privacy-title">
    <div class="container legal-container">
      <p class="eyebrow">{{ privacy.eyebrow }}</p>
      <h1 id="privacy-title">{{ privacy.title }}</h1>
      <p class="legal-updated">{{ privacy.updatedLabel }}: {{ privacy.updatedDate }}</p>

      <p v-for="(paragraph, index) in privacy.intro" :key="`intro-${index}`" class="legal-intro">
        {{ paragraph }}
      </p>

      <section v-for="section in privacy.sections" :key="section.heading" class="legal-section">
        <h2>{{ section.heading }}</h2>
        <p v-for="(paragraph, index) in section.paragraphs" :key="`p-${index}`">
          {{ paragraph }}
        </p>
        <ul v-if="section.items">
          <li v-for="(item, index) in section.items" :key="`i-${index}`">{{ item }}</li>
        </ul>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
const { privacy } = usePrivacyContent()

useAnturSeo({
  title: privacy.value.seoTitle,
  description: privacy.value.seoDescription,
  path: '/privacy'
})
</script>

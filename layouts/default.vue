<template>
  <div>
    <a class="skip-link" href="#main">{{ text.skip }}</a>

    <header class="site-header" :aria-label="text.navAria">
      <NuxtLink class="brand" :to="localePath('/')" :aria-label="`${businessText.brand} ${businessText.tagline}, ${text.homeAria}`">
        <picture class="brand-logo-picture">
          <source type="image/webp" :srcset="assetPath('/images/antur-logo-mark.webp')">
          <img class="brand-logo" :src="assetPath('/images/antur-logo-mark.png')" width="82" height="62" alt="" aria-hidden="true">
        </picture>
        <span>
          <strong class="brand-word">{{ businessText.brand }}</strong>
          <small>{{ businessText.tagline }}</small>
        </span>
      </NuxtLink>

      <nav class="nav-links" :aria-label="text.navAria">
        <NuxtLink :to="localePath('/#routes')">{{ text.nav.routes }}</NuxtLink>
        <NuxtLink :to="localePath('/#gallery')">{{ text.nav.gallery }}</NuxtLink>
        <NuxtLink :to="localePath('/#reviews')">{{ text.nav.reviews }}</NuxtLink>
        <NuxtLink :to="localePath('/#booking')">{{ text.nav.booking }}</NuxtLink>
      </nav>

      <div class="header-tools">
        <LanguageSwitcher />
        <ContactButton class="header-contact" :label="text.contact.book" :context="text.contact.bookContext" />
      </div>
    </header>

    <main id="main">
      <slot />
    </main>

    <LazyLocationMap />

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <NuxtLink class="footer-brand" :to="localePath('/')">
            <picture>
              <source type="image/webp" :srcset="assetPath('/images/antur-logo-mark.webp')">
              <img :src="assetPath('/images/antur-logo-mark.png')" width="82" height="62" alt="" aria-hidden="true">
            </picture>
            <span>{{ businessText.brand }}</span>
          </NuxtLink>
          <p>{{ businessText.legalName }}</p>
        </div>
        <address class="footer-contact">
          <div class="footer-contact-row">
            <a class="footer-phone" :href="business.phoneHref">{{ business.phone }}</a>
            <a class="messenger-icon" :href="business.whatsappHref" target="_blank" rel="noopener" :aria-label="text.contact.whatsapp">
              <img :src="assetPath('/images/whatsapp-glyph.svg')" width="24" height="24" alt="" aria-hidden="true">
            </a>
            <a class="messenger-icon messenger-icon-max" :href="business.maxHref" target="_blank" rel="noopener" :aria-label="text.contact.max">
              <img :src="assetPath('/images/max-logo.svg')" width="24" height="24" alt="" aria-hidden="true">
            </a>
          </div>
        </address>
      </div>
    </footer>

    <div class="mobile-cta" :aria-label="text.contact.options">
      <ContactButton :label="text.contact.cta" :context="text.contact.mobileContext" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const assetPath = useAssetPath()
const { localePath, text, businessText } = useLocaleContent()
</script>

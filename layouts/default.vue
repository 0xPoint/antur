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
          <NuxtLink class="footer-legal-link" :to="localePath('/privacy')">{{ privacy.linkLabel }}</NuxtLink>
          <nav class="footer-routes" :aria-label="text.nav.routes">
            <NuxtLink v-for="offer in routeOffers" :key="offer.slug" :to="localePath(`/routes/${offer.slug}`)">
              {{ offer.title }}
            </NuxtLink>
            <template v-if="locale === 'ru'">
              <NuxtLink v-for="page in seoLandingPages" :key="page.slug" :to="`/${page.slug}`">
                {{ page.title }}
              </NuxtLink>
              <NuxtLink v-for="page in infoPages" :key="page.slug" :to="`/${page.slug}`">
                {{ page.title }}
              </NuxtLink>
            </template>
          </nav>
        </div>
        <address class="footer-contact">
          <div class="footer-contact-row">
            <a class="footer-phone" :href="business.phoneHref" @click="trackFooterContact('footer_phone_click')">{{ business.phone }}</a>
            <a
              class="messenger-icon"
              :href="business.whatsappHref"
              target="_blank"
              rel="noopener"
              :aria-label="text.contact.whatsapp"
              @click="trackFooterContact('footer_whatsapp_click')"
            >
              <img :src="assetPath('/images/whatsapp-glyph.svg')" width="24" height="24" alt="" aria-hidden="true">
            </a>
            <a
              class="messenger-icon messenger-icon-max"
              :href="business.maxHref"
              target="_blank"
              rel="noopener"
              :aria-label="text.contact.max"
              @click="trackFooterContact('footer_max_click')"
            >
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
import { infoPages } from '~/data/info-pages'
import { seoLandingPages } from '~/data/seo-pages'

const assetPath = useAssetPath()
const { locale, localePath, text, businessText, privacy, routeOffers } = useLocaleContent()
const route = useRoute()
const { $reachGoal } = useNuxtApp()

const trackFooterContact = (goal: string) => {
  $reachGoal?.(goal, {
    locale: locale.value,
    path: route.fullPath,
    placement: 'footer'
  })
}
</script>

<template>
  <div>
    <a class="skip-link" href="#main">{{ text.skip }}</a>

    <header class="site-header" :class="{ 'site-header-menu-open': mobileMenuOpen }" :aria-label="text.navAria">
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
        <div class="nav-dropdown">
          <NuxtLink class="nav-link nav-dropdown-trigger" :to="seaHubPath" aria-haspopup="true">
            {{ text.nav.routes }}
            <span class="nav-caret" aria-hidden="true" />
          </NuxtLink>
          <div class="nav-dropdown-menu" :aria-label="text.nav.seaRoutesLabel">
            <NuxtLink v-for="item in seaNavLinks" :key="item.path" :to="item.path">
              {{ item.title }}
            </NuxtLink>
          </div>
        </div>
        <div class="nav-dropdown">
          <NuxtLink class="nav-link nav-dropdown-trigger" :to="fishingHubPath" aria-haspopup="true">
            {{ text.nav.fishing }}
            <span class="nav-caret" aria-hidden="true" />
          </NuxtLink>
          <div class="nav-dropdown-menu" :aria-label="text.nav.fishingRoutesLabel">
            <NuxtLink v-for="item in fishingNavLinks" :key="item.path" :to="item.path">
              {{ item.title }}
            </NuxtLink>
          </div>
        </div>
        <NuxtLink :to="localePath('/#gallery')">{{ text.nav.gallery }}</NuxtLink>
        <NuxtLink :to="localePath('/#reviews')">{{ text.nav.reviews }}</NuxtLink>
        <NuxtLink :to="localePath('/#booking')">{{ text.nav.booking }}</NuxtLink>
      </nav>

      <div class="header-tools">
        <LanguageSwitcher />
        <ContactButton class="header-contact" :label="text.contact.book" :context="text.contact.bookContext" />
        <button
          class="nav-burger"
          type="button"
          :class="{ 'nav-burger-open': mobileMenuOpen }"
          :aria-label="mobileMenuOpen ? text.nav.menuClose : text.nav.menuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-nav"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <nav v-show="mobileMenuOpen" id="mobile-nav" class="mobile-nav" :aria-label="text.navAria">
        <div class="mobile-nav-group">
          <NuxtLink class="mobile-nav-heading" :to="seaHubPath">{{ text.nav.routes }}</NuxtLink>
          <NuxtLink v-for="item in seaNavLinks" :key="item.path" :to="item.path">
            {{ item.title }}
          </NuxtLink>
        </div>
        <div class="mobile-nav-group">
          <NuxtLink class="mobile-nav-heading" :to="fishingHubPath">{{ text.nav.fishing }}</NuxtLink>
          <NuxtLink v-for="item in fishingNavLinks" :key="item.path" :to="item.path">
            {{ item.title }}
          </NuxtLink>
        </div>
        <div class="mobile-nav-group">
          <NuxtLink :to="charterPath">{{ text.nav.charter }}</NuxtLink>
          <NuxtLink :to="localePath('/#gallery')">{{ text.nav.gallery }}</NuxtLink>
          <NuxtLink :to="localePath('/#reviews')">{{ text.nav.reviews }}</NuxtLink>
          <NuxtLink :to="localePath('/#booking')">{{ text.nav.booking }}</NuxtLink>
        </div>
      </nav>
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
            <NuxtLink v-for="offer in routeOffers" :key="offer.slug" :to="offer.path">
              {{ offer.title }}
            </NuxtLink>
            <template v-if="locale === 'ru'">
              <NuxtLink v-for="page in ruOnlySeoLandingLinks" :key="page.path" :to="page.path">
                {{ page.title }}
              </NuxtLink>
              <NuxtLink v-for="page in ruOnlyInfoPageLinks" :key="page.path" :to="page.path">
                {{ page.title }}
              </NuxtLink>
              <NuxtLink v-for="page in ruOnlyGuideLinks" :key="page.path" :to="page.path">
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
import { ruOnlyGuideLinks, ruOnlyInfoPageLinks, ruOnlySeoLandingLinks } from '~/data/ru-only-pages'

const assetPath = useAssetPath()
const { locale, localePath, text, businessText, privacy, routeOffers } = useLocaleContent()
const route = useRoute()
const { $reachGoal } = useNuxtApp()
const seaRouteSlugs = ['avachinskaya-buhta', 'ostrov-starichkov', 'buhta-russkaya']
const fishingRouteSlugs = ['rybalka', 'glubokovodnaya-rybalka']
const ruSeaSeoNavLinks = [
  { path: '/morskie-progulki/krabovoe-safari/', title: 'Крабовое сафари' },
  { path: '/morskie-progulki-petropavlovsk-kamchatskiy/', title: 'Из Петропавловска-Камчатского' }
]
const ruFishingSeoNavLinks = [
  { path: '/rybalka/sezon-rybalki/', title: 'Сезон рыбалки' }
]
const routeNavTitles: Record<string, Record<string, string>> = {
  ru: {
    rybalka: 'Морская рыбалка',
    'glubokovodnaya-rybalka': 'Глубоководная рыбалка',
    'buhta-russkaya': 'Бухта Русская',
    'ostrov-starichkov': 'Остров Старичков',
    'avachinskaya-buhta': 'Авачинская бухта'
  },
  en: {
    rybalka: 'Coastal fishing',
    'glubokovodnaya-rybalka': 'Deep-sea fishing'
  },
  zh: {
    rybalka: '近海海钓',
    'glubokovodnaya-rybalka': '深海海钓'
  }
}
const routeNavLinks = (slugs: string[]) =>
  slugs.flatMap((slug) => {
    const offer = routeOffers.value.find((item) => item.slug === slug)

    return offer
      ? [{
          path: offer.path,
          title: routeNavTitles[locale.value]?.[slug] || offer.title
        }]
      : []
  })
const seaHubPath = computed(() => locale.value === 'ru' ? '/morskie-progulki/' : localePath('/#routes'))
const fishingHubPath = computed(() => locale.value === 'ru' ? '/rybalka/' : localePath('/#routes'))
const charterPath = computed(() => locale.value === 'ru' ? '/arenda-katera/' : localePath('/#booking'))
const seaNavLinks = computed(() => [
  ...routeNavLinks(seaRouteSlugs),
  ...(locale.value === 'ru' ? ruSeaSeoNavLinks : [])
])
const fishingNavLinks = computed(() => [
  ...routeNavLinks(fishingRouteSlugs),
  ...(locale.value === 'ru' ? ruFishingSeoNavLinks : [])
])

const mobileMenuOpen = ref(false)
watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})
watch(mobileMenuOpen, (open) => {
  document.documentElement.classList.toggle('mobile-nav-lock', open)
})

const trackFooterContact = (goal: string) => {
  $reachGoal?.(goal, {
    locale: locale.value,
    path: route.fullPath,
    placement: 'footer'
  })
}
</script>

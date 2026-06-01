<template>
  <div>
    <a class="skip-link" href="#main">Перейти к содержанию</a>

    <header class="site-header" aria-label="Основная навигация">
      <NuxtLink class="brand" to="/" aria-label="Антур, на главную">
        <img class="brand-logo" :src="assetPath('/images/antur-logo-mark.png')" width="82" height="62" alt="" aria-hidden="true">
        <span>
          <strong class="brand-word">{{ business.brand }}</strong>
          <small>sea tours kamchatka</small>
        </span>
      </NuxtLink>

      <nav class="nav-links" aria-label="Разделы сайта">
        <NuxtLink to="/#routes">Маршруты</NuxtLink>
        <NuxtLink to="/#reviews">Отзывы</NuxtLink>
        <NuxtLink to="/#booking">Бронь</NuxtLink>
      </nav>

      <ContactButton class="header-contact" label="Связаться" variant="ghost" context="Вопрос с сайта" />
    </header>

    <main id="main">
      <slot />
    </main>

    <LocationMap />

    <footer class="site-footer">
      <div class="container footer-grid">
        <div>
          <NuxtLink class="footer-brand" to="/">
            <img :src="assetPath('/images/antur-logo-mark.png')" width="82" height="62" alt="" aria-hidden="true">
            <span>{{ business.brand }}</span>
          </NuxtLink>
          <p>{{ business.legalName }}</p>
        </div>
        <address class="footer-contact">
          <div class="footer-contact-row">
            <a class="footer-phone" :href="business.phoneHref">{{ business.phone }}</a>
            <a class="messenger-icon" :href="business.whatsappHref" target="_blank" rel="noopener" aria-label="Написать в WhatsApp">
              <img :src="assetPath('/images/whatsapp-glyph.svg')" width="24" height="24" alt="" aria-hidden="true">
            </a>
            <a class="messenger-icon messenger-icon-max" :href="business.maxHref" target="_blank" rel="noopener" aria-label="Написать в MAX">
              <img :src="assetPath('/images/max-logo.svg')" width="24" height="24" alt="" aria-hidden="true">
            </a>
          </div>
        </address>
      </div>
    </footer>

    <div class="mobile-cta" aria-label="Быстрая связь">
      <ContactButton label="Связаться" context="Вопрос с мобильной версии" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const assetPath = useAssetPath()
</script>

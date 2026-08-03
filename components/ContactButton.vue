<template>
  <div class="contact-widget" :class="{ 'contact-widget-panel': presentation === 'panel' }">
    <button
      v-if="presentation === 'panel'"
      class="detail-panel detail-panel-link contact-panel"
      type="button"
      @click="openModal"
    >
      <span v-if="eyebrow">{{ eyebrow }}</span>
      <strong>{{ label }}</strong>
      <p v-if="description">{{ description }}</p>
    </button>
    <button v-else class="btn" :class="buttonClass" type="button" @click="openModal">
      {{ label }}
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" :aria-labelledby="modalTitleId">
        <div class="contact-dialog">
          <button class="contact-close" type="button" :aria-label="text.contact.close" @click="closeModal">×</button>
          <div>
            <p class="eyebrow">{{ text.contact.eyebrow }}</p>
            <h2 :id="modalTitleId">{{ text.contact.title }}</h2>
            <p class="contact-lead">{{ text.contact.lead }}</p>
          </div>

          <div class="contact-options" :aria-label="text.contact.options">
            <a
              class="contact-option"
              :href="business.maxHref"
              target="_blank"
              rel="noopener"
              @click="trackContact('contact_max_click')"
            >
              <img :src="assetPath('/images/max-logo.svg')" width="28" height="28" alt="" aria-hidden="true">
              <span>{{ text.contact.max }}</span>
            </a>
            <a class="contact-option" :href="whatsappHref" target="_blank" rel="noopener" @click="trackContact('contact_whatsapp_click')">
              <img :src="assetPath('/images/whatsapp-glyph.svg')" width="28" height="28" alt="" aria-hidden="true">
              <span>WhatsApp</span>
            </a>
            <a class="contact-option" :href="business.phoneHref" @click="trackContact('contact_phone_click')">
              <span class="phone-icon" aria-hidden="true">☎</span>
              <span>{{ text.contact.call }}</span>
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const assetPath = useAssetPath()
const { locale, text } = useLocaleContent()
const route = useRoute()
const { $reachGoal } = useNuxtApp()
const props = withDefaults(defineProps<{
  label?: string
  variant?: 'primary' | 'ghost' | 'dark'
  presentation?: 'button' | 'panel'
  eyebrow?: string
  description?: string
  context?: string
}>(), {
  label: undefined,
  variant: 'primary',
  presentation: 'button',
  eyebrow: undefined,
  description: undefined,
  context: 'Морская прогулка'
})

const isOpen = ref(false)
const modalTitleId = useId()

const buttonClass = computed(() => ({
  'btn-primary': props.variant === 'primary',
  'btn-ghost': props.variant === 'ghost',
  'btn-dark': props.variant === 'dark'
}))
const label = computed(() => props.label || text.value.contact.cta)
const contactMessage = computed(() => {
  if (locale.value === 'en') {
    return `Hello! I would like to check dates and availability: ${props.context}.`
  }

  if (locale.value === 'zh') {
    return `您好！我想确认日期和名额：${props.context}。`
  }

  return business.messengerText
})
const whatsappHref = computed(() =>
  `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(contactMessage.value)}`
)
const trackContact = (goal: string) => {
  $reachGoal?.(goal, {
    context: props.context,
    locale: locale.value,
    path: route.fullPath
  })
}

const openModal = () => {
  trackContact('contact_modal_open')
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

watch(isOpen, (open) => {
  if (!import.meta.client) {
    return
  }

  document.body.classList.toggle('modal-open', open)
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (import.meta.client) {
    document.body.classList.remove('modal-open')
  }
})
</script>

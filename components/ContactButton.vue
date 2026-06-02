<template>
  <div class="contact-widget">
    <button class="btn" :class="buttonClass" type="button" @click="openModal">
      {{ label }}
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" :aria-labelledby="modalTitleId">
        <div class="contact-dialog">
          <button class="contact-close" type="button" aria-label="Закрыть окно связи" @click="closeModal">×</button>
          <div>
            <p class="eyebrow">Связь</p>
            <h2 :id="modalTitleId">Как удобнее связаться?</h2>
            <p class="contact-lead">Напишите в мессенджер или позвоните. Подскажем свободные даты, маршрут и условия выхода.</p>
          </div>

          <div class="contact-options" aria-label="Быстрые варианты связи">
            <a class="contact-option" :href="business.maxHref" target="_blank" rel="noopener">
              <img :src="assetPath('/images/max-logo.svg')" width="28" height="28" alt="" aria-hidden="true">
              <span>MAX</span>
            </a>
            <a class="contact-option" :href="business.whatsappHref" target="_blank" rel="noopener">
              <img :src="assetPath('/images/whatsapp-glyph.svg')" width="28" height="28" alt="" aria-hidden="true">
              <span>WhatsApp</span>
            </a>
            <a class="contact-option" :href="business.phoneHref">
              <span class="phone-icon" aria-hidden="true">☎</span>
              <span>Позвонить</span>
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
const props = withDefaults(defineProps<{
  label?: string
  variant?: 'primary' | 'ghost' | 'dark'
  context?: string
}>(), {
  label: 'Связаться',
  variant: 'primary',
  context: 'Морская прогулка'
})

const isOpen = ref(false)
const modalTitleId = useId()

const buttonClass = computed(() => ({
  'btn-primary': props.variant === 'primary',
  'btn-ghost': props.variant === 'ghost',
  'btn-dark': props.variant === 'dark'
}))

const openModal = () => {
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

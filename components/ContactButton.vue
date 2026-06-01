<template>
  <div class="contact-widget">
    <button class="btn" :class="buttonClass" type="button" @click="openModal">
      {{ label }}
    </button>

    <Teleport to="body">
      <div v-if="isOpen" class="contact-modal" role="dialog" aria-modal="true" :aria-labelledby="modalTitleId" @click.self="closeModal">
        <div class="contact-dialog">
          <button class="contact-close" type="button" aria-label="Закрыть окно связи" @click="closeModal">×</button>
          <div>
            <p class="eyebrow">Связь</p>
            <h2 :id="modalTitleId">Как удобнее связаться?</h2>
            <p class="contact-lead">Напишите в мессенджер, позвоните или оставьте номер. Подскажем свободные даты, маршрут и условия выхода.</p>
          </div>

          <div class="contact-options" aria-label="Быстрые варианты связи">
            <a class="contact-option" :href="business.maxHref" target="_blank" rel="noopener">
              <img src="/images/max-logo.svg" width="28" height="28" alt="" aria-hidden="true">
              <span>MAX</span>
            </a>
            <a class="contact-option" :href="business.whatsappHref" target="_blank" rel="noopener">
              <img src="/images/whatsapp-glyph.svg" width="28" height="28" alt="" aria-hidden="true">
              <span>WhatsApp</span>
            </a>
            <a class="contact-option" :href="business.phoneHref">
              <span class="phone-icon" aria-hidden="true">☎</span>
              <span>Позвонить</span>
            </a>
          </div>

          <a class="contact-phone" :href="business.phoneHref">{{ business.phone }}</a>

          <form class="lead-form" @submit.prevent="submitLead">
            <label>
              <span>Имя</span>
              <input v-model="form.name" name="name" autocomplete="name" placeholder="Как к вам обращаться">
            </label>
            <label>
              <span>Телефон</span>
              <input v-model="form.phone" name="phone" autocomplete="tel" inputmode="tel" placeholder="+7" required>
            </label>
            <label>
              <span>Комментарий</span>
              <textarea v-model="form.message" name="message" rows="3" :placeholder="contextPlaceholder" />
            </label>
            <button class="btn btn-primary" type="submit" :disabled="submitStatus === 'sending'">
              {{ submitStatus === 'sent' ? 'Отправлено' : submitStatus === 'sending' ? 'Отправляем...' : 'Отправить' }}
            </button>
            <p v-if="submitStatus === 'error'" class="form-status" role="alert">Не удалось отправить заявку. Позвоните или напишите в мессенджер.</p>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

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
const submitStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const modalTitleId = useId()
const form = reactive({
  name: '',
  phone: '',
  message: ''
})

const buttonClass = computed(() => ({
  'btn-primary': props.variant === 'primary',
  'btn-ghost': props.variant === 'ghost',
  'btn-dark': props.variant === 'dark'
}))
const contextPlaceholder = computed(() => `Здравствуйте! Хочу уточнить: ${props.context}`)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const submitLead = async () => {
  submitStatus.value = 'sending'

  try {
    await $fetch('/api/leads', {
      method: 'POST',
      body: {
        ...form,
        context: props.context
      }
    })

    submitStatus.value = 'sent'
    form.name = ''
    form.phone = ''
    form.message = ''
  } catch {
    submitStatus.value = 'error'
  }
}
</script>

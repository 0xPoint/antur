<script setup lang="ts">
import { calendarCells } from '~/utils/booking-calendar'

definePageMeta({ layout: false })
useHead({ title: 'Кабинет менеджера — Антур', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
type Day = { date: string, is_open: boolean }
type Boat = { id: string, name: string, capacity: number }
const username = ref('')
const password = ref('')
const loggedIn = ref(false)
const loading = ref(true)
const busy = ref(false)
const message = ref('')
const error = ref('')
const year = ref(2026)
const month = ref(1)
const boat = ref<Boat | null>(null)
const openDays = ref<number[]>([])
const savedDays = ref<number[]>([])
const version = ref(0)
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const cells = computed(() => calendarCells(year.value, month.value))
const monthKey = computed(() => `${year.value}-${String(month.value).padStart(2, '0')}`)
const monthTitle = computed(() => new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year.value, month.value - 1, 1))))
const dirty = computed(() => [...openDays.value].sort((a,b) => a-b).join(',') !== [...savedDays.value].sort((a,b) => a-b).join(','))

async function loadMonth() {
  busy.value = true; error.value = ''; message.value = ''; boat.value = null; openDays.value = []; savedDays.value = []
  try {
    const result = await $fetch<{ boat: Boat | null, days: Day[], version: number }>('/api/manager/month', { query: { month: monthKey.value } })
    boat.value = result.boat
    version.value = result.version
    openDays.value = result.days.filter(day => day.is_open).map(day => Number(day.date.slice(-2)))
    savedDays.value = [...openDays.value]
  } catch { error.value = 'Не удалось загрузить месяц. Проверьте соединение и войдите снова.' } finally { busy.value = false }
}
onMounted(async () => {
  const dateParts = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Kamchatka' }).formatToParts(new Date())
  year.value = Number(dateParts.find(part => part.type === 'year')?.value)
  month.value = Number(dateParts.find(part => part.type === 'month')?.value)
  try { await $fetch('/api/manager/session'); loggedIn.value = true; await loadMonth() } catch { loggedIn.value = false } finally { loading.value = false }
})
async function login() {
  busy.value = true; error.value = ''
  try { await $fetch('/api/manager/login', { method: 'POST', body: { username: username.value, password: password.value } }); password.value = ''; loggedIn.value = true; await loadMonth() }
  catch (err: any) { error.value = err?.statusCode === 429 ? 'Слишком много попыток. Повторите вход через 15 минут.' : err?.statusCode === 503 ? 'Доступ к кабинету ещё не настроен.' : 'Не удалось войти. Проверьте логин и пароль.' }
  finally { busy.value = false }
}
async function logout() {
  try { await $fetch('/api/manager/logout', { method: 'POST' }); loggedIn.value = false; boat.value = null; openDays.value = []; username.value = ''; error.value = '' }
  catch { error.value = 'Не удалось выйти. Проверьте соединение и повторите.' }
}
async function moveMonth(step: number) {
  if (dirty.value && !window.confirm('В месяце есть несохранённые изменения. Перейти без сохранения?')) return
  const date = new Date(Date.UTC(year.value, month.value - 1 + step, 1))
  year.value = date.getUTCFullYear(); month.value = date.getUTCMonth() + 1
  await loadMonth()
}
function toggleDay(day: number) { openDays.value = openDays.value.includes(day) ? openDays.value.filter(value => value !== day) : [...openDays.value, day] }
async function save() {
  if (!boat.value) return
  busy.value = true; error.value = ''; message.value = ''
  try {
    const result = await $fetch<{ version: number }>('/api/manager/month', { method: 'PUT', body: { boatId: Number(boat.value.id), year: year.value, month: month.value, openDays: openDays.value, version: version.value } })
    version.value = result.version
    savedDays.value = [...openDays.value]; message.value = 'Настройки месяца сохранены.'
  } catch (err: any) { error.value = err?.statusCode === 409 ? 'Месяц изменён в другой вкладке. Обновите страницу и проверьте настройки.' : 'Не удалось сохранить месяц. Проверьте соединение и повторите.' } finally { busy.value = false }
}
</script>

<template>
  <div class="manager-app">
    <header class="manager-header">
      <NuxtLink class="manager-brand" to="/"><img src="/images/antur-logo-mark.webp" width="48" height="36" alt=""><span>АНТУР <small>КАБИНЕТ МЕНЕДЖЕРА</small></span></NuxtLink>
      <button v-if="loggedIn" class="ghost" type="button" @click="logout">Выйти</button>
    </header>
    <main class="manager-main">
      <p v-if="loading" role="status">Загружаем кабинет…</p>
      <section v-else-if="!loggedIn" class="login-panel">
        <p class="eyebrow">АНТУР · УПРАВЛЕНИЕ РЕЙСАМИ</p>
        <h1>Вход в кабинет</h1>
        <p class="muted">Войдите, чтобы настроить доступность дней.</p>
        <form @submit.prevent="login">
          <label for="manager-user">Логин</label><input id="manager-user" v-model.trim="username" autocomplete="username" required maxlength="128">
          <label for="manager-pass">Пароль</label><input id="manager-pass" v-model="password" type="password" autocomplete="current-password" required maxlength="512">
          <p v-if="error" role="alert" class="error">{{ error }}</p>
          <button class="primary" :disabled="busy">{{ busy ? 'Входим…' : 'Войти' }}</button>
        </form>
      </section>
      <template v-else>
        <div class="page-heading"><div><p class="eyebrow">УПРАВЛЕНИЕ РАСПИСАНИЕМ</p><h1>Доступность дней</h1><p class="muted">Настройте дни, доступные для бронирования.</p></div><span v-if="boat" class="boat">{{ boat.name }} · до {{ boat.capacity }} гостей</span></div>
        <p v-if="error" role="alert" class="error">{{ error }}</p><p v-if="message" role="status" class="success">{{ message }}</p>
        <section v-if="boat" class="calendar-panel">
          <div class="calendar-heading"><button class="ghost arrow" aria-label="Предыдущий месяц" :disabled="busy" @click="moveMonth(-1)">‹</button><h2>{{ monthTitle }}</h2><button class="ghost arrow" aria-label="Следующий месяц" :disabled="busy" @click="moveMonth(1)">›</button></div>
          <p class="muted instruction">Нажмите на дату, чтобы открыть или закрыть её для новых бронирований.</p>
          <div class="grid weekdays" aria-hidden="true"><span v-for="day in weekdays" :key="day">{{ day }}</span></div>
          <div class="grid dates"><template v-for="(day, index) in cells" :key="index"><span v-if="!day"/><button v-else type="button" :class="{ open: openDays.includes(day) }" :aria-label="`${day}, ${openDays.includes(day) ? 'открыто' : 'закрыто'}`" :aria-pressed="openDays.includes(day)" @click="toggleDay(day)"><strong>{{ day }}</strong><small>{{ openDays.includes(day) ? 'Открыто' : 'Закрыто' }}</small></button></template></div>
          <div class="calendar-footer"><p class="muted">Закрытие дня не отменяет существующие бронирования.</p><button class="primary" :disabled="busy || !dirty" @click="save">{{ busy ? 'Сохраняем…' : 'Сохранить месяц' }}</button></div>
        </section>
        <p v-else-if="busy" role="status" class="muted">Загружаем расписание…</p>
        <div v-else-if="!error" class="login-panel"><h2>Добавьте катер</h2><p class="muted">Для настройки расписания сначала нужно добавить катер в базу.</p></div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.manager-app{min-height:100vh;background:#050d14;color:#fff}.manager-header{height:74px;border-bottom:1px solid #263846;display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100vw - 1200px)/2));gap:16px}.manager-brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.1em}.manager-brand img{object-fit:contain}.manager-brand small{display:block;color:#aabcca;font-size:9px;letter-spacing:.13em}.manager-main{max-width:1200px;padding:56px 24px 100px;margin:auto}.eyebrow{font-size:12px;letter-spacing:.1em;color:#e5b96f;font-weight:800}.manager-main h1{font-size:clamp(32px,4vw,46px);line-height:1.1;margin:8px 0}.muted{color:#b7c9d6}.login-panel,.calendar-panel{background:#0a1b28;border:1px solid #244050;border-radius:16px;padding:32px}.login-panel{max-width:480px;margin:8vh auto}.login-panel form{margin-top:28px}.login-panel label{display:block;font-size:14px;font-weight:700;margin:18px 0 7px}.login-panel input{width:100%;background:#102a3a;border:1px solid #4a6270;border-radius:8px;color:white;padding:13px;font:inherit}.primary,.ghost{border:0;border-radius:8px;font:inherit;font-weight:700;cursor:pointer}.primary{background:#cf4810;color:white;padding:13px 22px}.primary:disabled{opacity:.5;cursor:not-allowed}.login-panel .primary{width:100%;margin-top:22px}.ghost{background:#172b39;color:white;border:1px solid #3b5362;padding:9px 15px}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:28px}.boat{color:#e5b96f;border:1px solid #654e31;border-radius:50px;padding:8px 14px;font-size:13px;white-space:nowrap}.calendar-heading{display:flex;align-items:center;justify-content:space-between}.calendar-heading h2{text-transform:capitalize;font-size:24px;margin:0}.arrow{font-size:24px;line-height:1;width:44px;height:44px}.instruction{font-size:14px;margin:16px 0 24px}.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.weekdays{text-align:center;color:#b7c9d6;font-size:13px;font-weight:700;margin-bottom:10px}.dates button{min-height:76px;border-radius:8px;border:1px solid #354956;background:#122331;color:white;text-align:left;padding:10px;cursor:pointer}.dates button.open{background:#213a35;border-color:#527c6b}.dates strong,.dates small{display:block}.dates small{color:#b7c9d6;margin-top:6px}.dates button.open small{color:#b0dfc4}.calendar-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:24px;font-size:14px}.error{color:#ffc3b8;background:#4b211e;padding:12px;border-radius:8px}.success{color:#b4ebc6;background:#173f2f;padding:12px;border-radius:8px}button:focus-visible,input:focus-visible{outline:3px solid #8fd8cf;outline-offset:3px}@media(max-width:600px){.manager-main{padding:32px 16px 72px}.login-panel,.calendar-panel{padding:18px}.login-panel{margin:5vh auto}.page-heading{align-items:flex-start;flex-direction:column}.dates{gap:4px}.dates button{min-height:58px;padding:5px;text-align:center}.dates small{font-size:9px}.calendar-footer{align-items:stretch;flex-direction:column}.calendar-footer .primary{width:100%}}
</style>

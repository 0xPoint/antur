<script setup lang="ts">
import { calendarCells, routeNames, type RouteId } from '~/utils/booking-calendar'

definePageMeta({ layout: false })
useHead({ title: 'Кабинет менеджера — Антур', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
type Day = { date: string, is_open: boolean }
type Boat = { id: string, name: string, capacity: number }
type Guest = { id: string, name: string, phone: string, guests: number, status: string, paymentKopecks: number, refundReview: boolean, refundNote: string | null }
type Trip = { id: string, boat_id: string, route: RouteId | null, kind: 'shared' | 'private', confirmation: string, revision: number, date: string, start: string, end: string, capacity: number, bookings: Guest[] }
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
const trips = ref<Trip[]>([])
const tripId = ref('')
const selectedTrip = computed(() => trips.value.find(trip => trip.id === tripId.value))
const newTrip = reactive({ date: '', start: '08:00', end: '16:00', route: '' as RouteId | '', kind: 'shared' as 'shared' | 'private' })
const guestForm = reactive({ id: '', name: '', phone: '', guests: 1, paymentRubles: 0 })
const moveForm = reactive({ date: '', start: '08:00', end: '16:00' })
const replacementRoute = ref<RouteId>('russkaya')
const guestMessage = ref('')
const transferMonth = ref('')
const transferTargets = ref<Trip[]>([])
const transferGuest = ref('')
const transferTarget = ref('')
const statusNames: Record<string, string> = { held: 'Оформляет оплату', paid: 'Оплачено онлайн', manual_pending: 'Оплата не подтверждена', manual_confirmed: 'Предоплата отмечена', cancelled: 'Отменено', payment_review: 'Проверить оплату' }
const shortRoutes: Record<RouteId, string> = { russkaya: 'Русская', starichkov: 'Старичков', fishing: 'Рыбалка' }
const operationErrors: Record<string, string> = { STALE_TRIP: 'Рейс изменился. Данные обновлены; проверьте их и повторите действие.', TRIP_OVERLAP: 'Катер уже занят в это время.', NOT_ENOUGH_SEATS: 'Недостаточно свободных мест.', ACTIVE_CHECKOUT: 'Гость сейчас оформляет оплату. Повторите действие позже.', PAYMENT_REVIEW_REQUIRED: 'При уменьшении оплаченной группы используйте действие «Уменьшить группу» и проверьте возврат.', REFUND_PROVIDER_UNAVAILABLE: 'Возврат онлайн-оплаты пока нельзя обработать: платёжный сервис не подключён.', ROUTE_REQUIRED: 'Сначала выберите маршрут рейса.', TRIP_CANCELLED: 'Этот рейс уже отменён.', TRIP_UNAVAILABLE: 'Выбранный рейс недоступен или у него не указан маршрут.', INCOMPATIBLE_FORMAT: 'Перенос возможен только между рейсами одного формата.', BOOKING_UNAVAILABLE: 'Бронирование уже изменилось.' }
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const cells = computed(() => calendarCells(year.value, month.value))
const monthKey = computed(() => `${year.value}-${String(month.value).padStart(2, '0')}`)
watch(tripId, () => { transferMonth.value = monthKey.value; transferTargets.value = []; transferTarget.value = ''; transferGuest.value = ''; guestMessage.value = '' })
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
    await loadTrips()
  } catch { error.value = 'Не удалось загрузить месяц. Проверьте соединение и войдите снова.' } finally { busy.value = false }
}
async function loadTrips() {
  const result = await $fetch<{ trips: Trip[] }>('/api/manager/trips', { query: { month: monthKey.value } })
  trips.value = result.trips.filter(trip => trip.boat_id === boat.value?.id)
  if (!trips.value.some(trip => trip.id === tripId.value)) tripId.value = trips.value[0]?.id || ''
}
function tripsForDay(day: number) { return trips.value.filter(trip => Number(trip.date.slice(-2)) === day && trip.confirmation !== 'cancelled') }
function occupied(trip: Trip) { return trip.bookings.filter(guest => ['paid','manual_pending','manual_confirmed','held'].includes(guest.status)).reduce((sum, guest) => sum + guest.guests, 0) }
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
function resetGuest() { Object.assign(guestForm, { id: '', name: '', phone: '', guests: 1, paymentRubles: 0 }) }
function selectGuest(guest: Guest) { Object.assign(guestForm, { id: guest.id, name: guest.name, phone: guest.phone, guests: guest.guests, paymentRubles: guest.paymentKopecks / 100 }) }
async function operation(payload: Record<string, unknown>) {
  busy.value = true; error.value = ''; message.value = ''
  try {
    const result = await $fetch<{ id?: string }>('/api/manager/trips', { method: 'POST', body: payload })
    await loadTrips()
    if (result.id) tripId.value = result.id
    message.value = 'Изменения сохранены.'
    return true
  } catch (err: any) {
    const code = err?.data?.statusMessage || ''
    error.value = operationErrors[code] || 'Не удалось сохранить изменения. Проверьте данные и повторите.'
    if (code === 'STALE_TRIP') await loadTrips().catch(() => {})
    return false
  } finally { busy.value = false }
}
async function createTrip() {
  if (!boat.value || !newTrip.date.startsWith(monthKey.value)) { error.value = 'Выберите дату в открытом месяце.'; return }
  await operation({ action: 'createTrip', boatId: Number(boat.value.id), ...newTrip, route: newTrip.route || null })
}
async function saveGuest() {
  if (!selectedTrip.value) return
  const amount = Number(guestForm.paymentRubles)
  if (!Number.isFinite(amount) || amount < 0 || !Number.isSafeInteger(Math.round(amount * 100))) { error.value = 'Проверьте сумму оплаты.'; return }
  const ok = await operation({ action: guestForm.id ? 'updateGuest' : 'addGuest', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, bookingId: guestForm.id || undefined, name: guestForm.name, phone: guestForm.phone, guests: Number(guestForm.guests), paymentKopecks: Math.round(amount * 100) })
  if (ok) resetGuest()
}
async function cancelGuest(guest: Guest) {
  if (!selectedTrip.value || !window.confirm('Отменить бронирование? Если была оплата, потребуется отдельно проверить возврат.')) return
  await operation({ action: 'cancelBooking', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, bookingId: guest.id, paymentAcknowledged: true })
}
async function reduceGuests(guest: Guest) {
  if (!selectedTrip.value) return
  const response = window.prompt(`Сколько гостей остаётся в брони? Сейчас: ${guest.guests}. Вопрос возврата потребуется проверить отдельно.`)
  if (response === null) return
  const guests = Number(response)
  if (!Number.isInteger(guests) || guests < 1 || guests >= guest.guests) { error.value = 'Введите число от 1 до числа гостей меньше текущего.'; return }
  await operation({ action: 'reduceGuests', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, bookingId: guest.id, guests, paymentAcknowledged: true })
}
async function resolveRefund(guest: Guest) {
  if (!selectedTrip.value) return
  const note = window.prompt('Укажите, как решён вопрос оплаты или возврата. Это не отправляет деньги клиенту.')
  if (!note?.trim()) return
  const amountText = window.prompt('Сколько рублей фактически возвращено вручную? Если возврата не было, укажите 0.', '0')
  if (amountText === null) return
  const amount = Number(amountText.replace(',', '.'))
  if (!Number.isFinite(amount) || amount < 0 || amount * 100 > guest.paymentKopecks) { error.value = 'Проверьте сумму возврата.'; return }
  await operation({ action: 'resolveRefund', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, bookingId: guest.id, note: note.trim(), refundKopecks: Math.round(amount * 100), manuallyVerified: true })
}
async function confirmTrip() { if (selectedTrip.value && window.confirm('Подтвердить этот рейс?')) await operation({ action: 'confirmTrip', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision }) }
async function moveTrip() {
  if (!selectedTrip.value || !window.confirm('Вы согласовали новую дату и время со всеми участниками?')) return
  const changedMonth = moveForm.date.slice(0, 7) !== monthKey.value
  const ok = await operation({ action: 'moveTrip', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, ...moveForm, guestsAgreed: true })
  if (ok && changedMonth) message.value = 'Рейс перенесён. Откройте новый месяц, чтобы увидеть его.'
}
async function changeRoute() {
  if (!selectedTrip.value || !window.confirm('Вы согласовали новый маршрут и условия со всеми участниками?')) return
  await operation({ action: 'changeRoute', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, route: replacementRoute.value, guestsAgreed: true })
}
async function cancelTrip() {
  if (!selectedTrip.value || !window.confirm('Вы уведомили всех гостей об отмене? Оплаченные брони будут отмечены для проверки возврата.')) return
  await operation({ action: 'cancelTrip', tripId: Number(selectedTrip.value.id), revision: selectedTrip.value.revision, guestsNotified: true })
}
async function loadTransferTargets() {
  if (!/^20\d\d-(0[1-9]|1[0-2])$/.test(transferMonth.value)) { error.value = 'Выберите месяц для переноса.'; return }
  busy.value = true; error.value = ''; transferTargets.value = []; transferTarget.value = ''
  try {
    const result = await $fetch<{ trips: Trip[] }>('/api/manager/trips', { query: { month: transferMonth.value } })
    transferTargets.value = result.trips.filter(trip => trip.id !== selectedTrip.value?.id && trip.confirmation !== 'cancelled' && trip.route && trip.kind === selectedTrip.value?.kind)
  } catch { error.value = 'Не удалось загрузить рейсы для переноса.' } finally { busy.value = false }
}
async function transferBooking() {
  const source = selectedTrip.value
  const target = transferTargets.value.find(trip => trip.id === transferTarget.value)
  if (!source || !target || !transferGuest.value || !window.confirm('Вы согласовали перенос, маршрут и условия с гостем?')) return
  const ok = await operation({ action: 'transferBooking', tripId: Number(source.id), revision: source.revision, targetTripId: Number(target.id), targetRevision: target.revision, bookingId: transferGuest.value, guestAgreed: true })
  if (ok) { transferGuest.value = ''; transferTarget.value = ''; transferTargets.value = [] }
}
function whatsapp(phone: string, message = '') {
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('8')) digits = `7${digits.slice(1)}`
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
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
          <div class="grid dates"><template v-for="(day, index) in cells" :key="index"><span v-if="!day"/><button v-else type="button" :class="{ open: openDays.includes(day) }" :aria-label="`${day}, ${openDays.includes(day) ? 'открыто' : 'закрыто'}, ${tripsForDay(day).map(trip => `${trip.route ? routeNames[trip.route] : 'маршрут не выбран'}: ${occupied(trip)} из ${trip.capacity}`).join(', ')}`" :aria-pressed="openDays.includes(day)" @click="toggleDay(day)"><strong>{{ day }}</strong><small>{{ openDays.includes(day) ? 'Открыто' : 'Закрыто' }}</small><span v-for="trip in tripsForDay(day)" :key="trip.id" class="date-trip">{{ trip.route ? shortRoutes[trip.route] : 'Маршрут не выбран' }} · {{ occupied(trip) }}/{{ trip.capacity }}</span></button></template></div>
          <div class="calendar-footer"><p class="muted">Закрытие дня не отменяет существующие бронирования.</p><button class="primary" :disabled="busy || !dirty" @click="save">{{ busy ? 'Сохраняем…' : 'Сохранить месяц' }}</button></div>
        </section>
        <p v-else-if="busy" role="status" class="muted">Загружаем расписание…</p>
        <div v-else-if="!error" class="login-panel"><h2>Добавьте катер</h2><p class="muted">Для настройки расписания сначала нужно добавить катер в базу.</p></div>
        <section v-if="boat" class="work-panel">
          <div class="section-title"><div><p class="eyebrow">ПОЕЗДКИ</p><h2>Рейсы месяца</h2></div><span class="muted">{{ trips.length }} в этом месяце</span></div>
          <p v-if="!trips.length" class="muted">Рейсов пока нет. Создайте первый ниже.</p>
          <div v-else class="trip-list"><button v-for="trip in trips" :key="trip.id" type="button" :class="['trip-card', { active: trip.id === tripId }]" @click="tripId = trip.id; resetGuest()"><strong>{{ trip.date }} · {{ trip.start }}</strong><span>{{ trip.route ? routeNames[trip.route] : 'Маршрут не выбран' }}</span><small>{{ trip.kind === 'private' ? 'Катер целиком' : 'Сборная группа' }} · {{ trip.confirmation === 'confirmed' ? 'Рейс подтверждён' : trip.confirmation === 'cancelled' ? 'Отменён' : 'Ожидает подтверждения' }}</small></button></div>
          <details class="action-details"><summary>Создать рейс</summary><form class="fields" @submit.prevent="createTrip"><label>Дата<input v-model="newTrip.date" type="date" required></label><label>Начало<input v-model="newTrip.start" type="time" required></label><label>Окончание<input v-model="newTrip.end" type="time" required></label><label>Маршрут<select v-model="newTrip.route"><option value="">Пока не выбран</option><option v-for="(name, id) in routeNames" :key="id" :value="id">{{ name }}</option></select></label><label>Формат<select v-model="newTrip.kind"><option value="shared">Сборная группа</option><option value="private">Катер целиком</option></select></label><button class="primary" :disabled="busy">Создать рейс</button></form><p class="muted">Время указано по Камчатке. Рейс создаётся без автоматического подтверждения.</p></details>
        </section>
        <section v-if="selectedTrip" class="work-panel">
          <div class="section-title"><div><p class="eyebrow">{{ selectedTrip.date }} · {{ selectedTrip.start }}–{{ selectedTrip.end }}</p><h2>{{ selectedTrip.route ? routeNames[selectedTrip.route] : 'Маршрут не выбран' }}</h2><p class="muted">{{ selectedTrip.confirmation === 'confirmed' ? 'Рейс подтверждён' : selectedTrip.confirmation === 'cancelled' ? 'Рейс отменён' : 'Ожидает подтверждения' }} · {{ selectedTrip.kind === 'private' ? 'Катер целиком' : 'Сборная группа' }}</p><p class="muted">Занято {{ selectedTrip.bookings.filter(g => ['paid','manual_pending','manual_confirmed','held'].includes(g.status)).reduce((sum, g) => sum + g.guests, 0) }} из {{ selectedTrip.capacity }} мест</p></div><button v-if="selectedTrip.confirmation === 'pending'" class="ghost" :disabled="busy" @click="confirmTrip">Подтвердить рейс</button></div>
          <div v-if="selectedTrip.confirmation === 'confirmed' && selectedTrip.kind === 'shared' && selectedTrip.bookings.filter(g => ['paid','manual_confirmed'].includes(g.status)).reduce((sum, g) => sum + g.guests, 0) < 6" class="notice">Подтверждённых оплат меньше шести. Решение по рейсу принимает менеджер.</div>
          <h3>Гости и бронирования</h3>
          <p v-if="!selectedTrip.bookings.length" class="muted">Пока никто не записан.</p>
          <div v-else class="guests"><div v-for="guest in selectedTrip.bookings" :key="guest.id" class="guest"><div><strong>{{ guest.name }} · {{ guest.guests }} чел.</strong><span>{{ guest.phone }} · {{ statusNames[guest.status] || guest.status }}</span><span v-if="guest.paymentKopecks">Отмечено вручную: {{ guest.paymentKopecks / 100 }} ₽</span><span v-if="guest.refundReview" class="warning">Нужно проверить возврат</span><span v-if="guest.refundNote">Отметка менеджера: {{ guest.refundNote }}</span></div><div class="guest-actions"><a :href="whatsapp(guest.phone)" target="_blank" rel="noopener">WhatsApp</a><button v-if="guest.refundReview" class="link-button" @click="resolveRefund(guest)">Отметить решение</button><button v-if="['manual_pending','manual_confirmed'].includes(guest.status) && selectedTrip.confirmation !== 'cancelled'" class="link-button" @click="selectGuest(guest)">Изменить</button><button v-if="guest.guests > 1 && ['manual_pending','manual_confirmed','paid'].includes(guest.status) && selectedTrip.confirmation !== 'cancelled'" class="link-button" @click="reduceGuests(guest)">Уменьшить группу</button><button v-if="['manual_pending','manual_confirmed','paid'].includes(guest.status) && selectedTrip.confirmation !== 'cancelled'" class="link-button" @click="cancelGuest(guest)">Отменить бронь</button></div></div></div>
          <template v-if="selectedTrip.confirmation !== 'cancelled'">
            <details class="action-details" :open="guestForm.id ? true : undefined"><summary>{{ guestForm.id ? 'Изменить бронирование' : 'Добавить гостя' }}</summary><form class="fields" @submit.prevent="saveGuest"><label>Имя<input v-model.trim="guestForm.name" maxlength="120" required></label><label>Телефон<input v-model.trim="guestForm.phone" type="tel" maxlength="40" required></label><label>Число гостей<input v-model.number="guestForm.guests" type="number" min="1" max="11" required></label><label>Получено вручную, ₽<input v-model.number="guestForm.paymentRubles" type="number" min="0" step="0.01" required></label><button class="primary" :disabled="busy">{{ guestForm.id ? 'Сохранить гостя' : 'Добавить гостя' }}</button><button v-if="guestForm.id" class="ghost" type="button" @click="resetGuest">Очистить</button></form><p class="muted">Менеджер указывает только фактически полученную оплату. Автоматический возврат здесь не выполняется.</p></details>
            <details class="action-details"><summary>Подготовить сообщение гостям</summary><label class="message-label" for="guest-message">Текст сообщения</label><textarea id="guest-message" v-model="guestMessage" rows="4" maxlength="2000" placeholder="Напишите сообщение для участников" /><p class="muted">Выберите гостя: WhatsApp откроется с подготовленным текстом. Отправку подтверждаете сами. Автоматическая рассылка и MAX ещё не подключены.</p><div class="guest-actions"><a v-for="guest in selectedTrip.bookings.filter(g => ['paid','manual_pending','manual_confirmed'].includes(g.status))" :key="guest.id" :href="whatsapp(guest.phone, guestMessage)" target="_blank" rel="noopener">{{ guest.name }} · WhatsApp</a></div></details>
            <details class="action-details"><summary>Пересадить гостя в другую группу</summary><p class="muted">Сначала согласуйте с гостем новую дату, маршрут и стоимость. Оплата останется привязана к его бронированию.</p><div class="fields"><label>Месяц нового рейса<input v-model="transferMonth" type="month"></label><button class="ghost" type="button" :disabled="busy" @click="loadTransferTargets">Найти рейсы</button></div><form class="fields" @submit.prevent="transferBooking"><label>Бронирование<select v-model="transferGuest" required><option value="">Выберите гостя</option><option v-for="guest in selectedTrip.bookings.filter(g => ['paid','manual_pending','manual_confirmed'].includes(g.status) && !g.refundReview)" :key="guest.id" :value="guest.id">{{ guest.name }} · {{ guest.guests }} чел.</option></select></label><label>Новый рейс<select v-model="transferTarget" required><option value="">Выберите рейс</option><option v-for="target in transferTargets" :key="target.id" :value="target.id">{{ target.date }} · {{ target.start }} · {{ target.route ? routeNames[target.route] : '' }}</option></select></label><button class="ghost" :disabled="busy">Перенести гостя</button></form></details>
            <details class="action-details"><summary>Перенести рейс</summary><form class="fields" @submit.prevent="moveTrip"><label>Новая дата<input v-model="moveForm.date" type="date" required></label><label>Начало<input v-model="moveForm.start" type="time" required></label><label>Окончание<input v-model="moveForm.end" type="time" required></label><button class="ghost" :disabled="busy">Перенести</button></form><p class="muted">Перед переносом согласуйте дату со всеми участниками.</p></details>
            <details class="action-details"><summary>Изменить маршрут</summary><form class="fields" @submit.prevent="changeRoute"><label>Новый маршрут<select v-model="replacementRoute"><option v-for="(name, id) in routeNames" :key="id" :value="id">{{ name }}</option></select></label><button class="ghost" :disabled="busy">Изменить маршрут</button></form><p class="muted">Сначала согласуйте маршрут и условия с гостями.</p></details>
            <button class="danger" type="button" :disabled="busy" @click="cancelTrip">Отменить рейс</button>
          </template>
        </section>
      </template>
    </main>
  </div>
</template>

<style scoped>
.manager-app{min-height:100vh;background:#050d14;color:#fff}.manager-header{height:74px;border-bottom:1px solid #263846;display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100vw - 1200px)/2));gap:16px}.manager-brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.1em}.manager-brand img{object-fit:contain}.manager-brand small{display:block;color:#aabcca;font-size:9px;letter-spacing:.13em}.manager-main{max-width:1200px;padding:56px 24px 100px;margin:auto}.eyebrow{font-size:12px;letter-spacing:.1em;color:#e5b96f;font-weight:800}.manager-main h1{font-size:clamp(32px,4vw,46px);line-height:1.1;margin:8px 0}.muted{color:#b7c9d6}.login-panel,.calendar-panel{background:#0a1b28;border:1px solid #244050;border-radius:16px;padding:32px}.login-panel{max-width:480px;margin:8vh auto}.login-panel form{margin-top:28px}.login-panel label{display:block;font-size:14px;font-weight:700;margin:18px 0 7px}.login-panel input{width:100%;background:#102a3a;border:1px solid #4a6270;border-radius:8px;color:white;padding:13px;font:inherit}.primary,.ghost{border:0;border-radius:8px;font:inherit;font-weight:700;cursor:pointer}.primary{background:#cf4810;color:white;padding:13px 22px}.primary:disabled{opacity:.5;cursor:not-allowed}.login-panel .primary{width:100%;margin-top:22px}.ghost{background:#172b39;color:white;border:1px solid #3b5362;padding:9px 15px}.page-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:28px}.boat{color:#e5b96f;border:1px solid #654e31;border-radius:50px;padding:8px 14px;font-size:13px;white-space:nowrap}.calendar-heading{display:flex;align-items:center;justify-content:space-between}.calendar-heading h2{text-transform:capitalize;font-size:24px;margin:0}.arrow{font-size:24px;line-height:1;width:44px;height:44px}.instruction{font-size:14px;margin:16px 0 24px}.grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.weekdays{text-align:center;color:#b7c9d6;font-size:13px;font-weight:700;margin-bottom:10px}.dates button{min-height:76px;border-radius:8px;border:1px solid #354956;background:#122331;color:white;text-align:left;padding:10px;cursor:pointer}.dates button.open{background:#213a35;border-color:#527c6b}.dates strong,.dates small{display:block}.dates small{color:#b7c9d6;margin-top:6px}.dates button.open small{color:#b0dfc4}.calendar-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:24px;font-size:14px}.error{color:#ffc3b8;background:#4b211e;padding:12px;border-radius:8px}.success{color:#b4ebc6;background:#173f2f;padding:12px;border-radius:8px}button:focus-visible,input:focus-visible{outline:3px solid #8fd8cf;outline-offset:3px}@media(max-width:600px){.manager-main{padding:32px 16px 72px}.login-panel,.calendar-panel{padding:18px}.login-panel{margin:5vh auto}.page-heading{align-items:flex-start;flex-direction:column}.dates{gap:4px}.dates button{min-height:58px;padding:5px;text-align:center}.dates small{font-size:9px}.calendar-footer{align-items:stretch;flex-direction:column}.calendar-footer .primary{width:100%}}
</style>

<style scoped>
.date-trip{display:block;margin-top:5px;color:#f2c980;font-size:11px;line-height:1.25;overflow-wrap:anywhere}@media(max-width:600px){.date-trip{font-size:9px}}
.message-label{display:block;color:#b7c9d6;font-size:13px;margin-top:16px;margin-bottom:6px}textarea{width:100%;resize:vertical;border:1px solid #4a6270;background:#102a3a;color:#fff;border-radius:8px;padding:10px;font:inherit}textarea:focus-visible{outline:3px solid #8fd8cf;outline-offset:3px}
.work-panel{margin-top:24px;background:#0a1b28;border:1px solid #244050;border-radius:16px;padding:32px}.section-title{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.section-title h2{margin:4px 0;font-size:26px}.trip-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:20px}.trip-card{background:#102635;color:#fff;border:1px solid #355061;border-radius:10px;text-align:left;padding:15px;cursor:pointer}.trip-card.active{border-color:#e5b96f}.trip-card strong,.trip-card span,.trip-card small{display:block}.trip-card span{margin-top:7px}.trip-card small{color:#b7c9d6;margin-top:6px}.action-details{margin-top:18px;border-top:1px solid #304858;padding-top:18px}.action-details summary{font-weight:700;cursor:pointer}.action-details p{font-size:13px}.fields{display:flex;flex-wrap:wrap;gap:12px;align-items:end;margin-top:16px}.fields label{display:grid;gap:5px;min-width:140px;flex:1;color:#b7c9d6;font-size:13px}.fields input,.fields select{width:100%;border:1px solid #4a6270;background:#102a3a;color:#fff;border-radius:8px;padding:10px;font:inherit}.fields button{min-height:43px}.guests{display:grid;gap:8px}.guest{display:flex;justify-content:space-between;gap:16px;padding:14px;background:#102635;border-radius:8px}.guest span{display:block;color:#b7c9d6;font-size:13px}.guest .warning{color:#ffc88c}.guest-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:13px}.guest-actions a,.link-button{color:#f3c581;text-decoration:underline}.link-button{border:0;background:none;font:inherit;cursor:pointer;padding:0}.notice{padding:12px;border:1px solid #8d703d;background:#352b1b;border-radius:8px;color:#f3d498}.danger{margin-top:24px;padding:10px 15px;border:1px solid #d6796a;border-radius:8px;color:#ffc3b8;background:transparent;cursor:pointer}@media(max-width:600px){.work-panel{padding:18px}.section-title,.guest{flex-direction:column}.fields label,.fields button{width:100%}.trip-list{grid-template-columns:1fr}.guest-actions{justify-content:flex-start}}
</style>

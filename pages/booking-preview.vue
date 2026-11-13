<script setup lang="ts">
import { calendarCells, routeNames, type RouteId } from '~/utils/booking-calendar'
import { calendarDayState, type PublicDay } from '~/utils/public-booking'

useHead({ title: 'Календарь бронирования — предварительный просмотр', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
const year = ref(2027)
const month = ref(1)
const selected = ref<number | null>(null)
const selectedTrip = ref('')
const chosenRoute = ref<RouteId | ''>('')
const guestCount = ref(1)
const days = ref<PublicDay[]>([])
const loading = ref(false)
const loadError = ref(false)
let requestNumber = 0
const routes: RouteId[] = ['russkaya', 'starichkov', 'fishing']
const icons: Record<RouteId, string> = { russkaya: '▴', starichkov: '◭', fishing: '≈' }
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const cells = computed(() => calendarCells(year.value, month.value))
const monthKey = computed(() => `${year.value}-${String(month.value).padStart(2, '0')}`)
const title = computed(() => new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year.value, month.value - 1, 1))).replace(/^./, letter => letter.toLocaleUpperCase('ru')))
const selectedTitle = computed(() => selected.value === null ? '' : new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year.value, month.value - 1, selected.value))))
const dayRows = (day: number) => days.value.filter(row => row.date === `${monthKey.value}-${String(day).padStart(2, '0')}`)
const selectedRows = computed(() => selected.value === null ? [] : dayRows(selected.value))
const availableTrips = computed(() => selectedRows.value.filter(row => row.open && row.trip?.upcoming && row.trip.kind === 'shared'))
const active = computed(() => availableTrips.value.find(row => row.trip?.id === selectedTrip.value))
const stateText: Record<string, string> = { closed: 'Продажа не открыта', empty: 'Нет записавшихся', available: 'Есть места', full: 'Мест нет' }
function dayDescription(day: number) {
  const rows = dayRows(day)
  const routesHere = rows.filter(row => row.open && row.trip?.upcoming && row.trip.kind === 'shared').map(row => row.trip?.route ? routeNames[row.trip.route] : 'маршрут не выбран')
  return `${day} ${title.value}, ${stateText[calendarDayState(rows)]}${routesHere.length ? ', ' + routesHere.join(', ') : ''}`
}
function selectDay(day: number) {
  selected.value = day; chosenRoute.value = ''; guestCount.value = 1
  selectedTrip.value = availableTrips.value[0]?.trip?.id || ''
}
function selectTrip(id: string) { selectedTrip.value = id; chosenRoute.value = ''; guestCount.value = 1 }
async function loadMonth() {
  const request = ++requestNumber
  loading.value = true; loadError.value = false; days.value = []; selected.value = null; selectedTrip.value = ''
  try {
    const response = await $fetch<{ days: PublicDay[] }>('/api/booking/month', { query: { month: monthKey.value } })
    if (request === requestNumber) days.value = response.days
  } catch { if (request === requestNumber) loadError.value = true }
  finally { if (request === requestNumber) loading.value = false }
}
function moveMonth(step: number) {
  const next = new Date(Date.UTC(year.value, month.value - 1 + step, 1))
  const nextYear = next.getUTCFullYear()
  if (nextYear < 2026 || nextYear > 2100) return
  year.value = nextYear; month.value = next.getUTCMonth() + 1
  void loadMonth()
}
onMounted(() => {
  const parts = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Kamchatka' }).formatToParts(new Date())
  year.value = Number(parts.find(part => part.type === 'year')?.value)
  month.value = Number(parts.find(part => part.type === 'month')?.value)
  void loadMonth()
})
</script>

<template>
  <section class="booking-preview container">
    <div class="preview-note" role="note">Предварительный просмотр · оформление и оплата ещё не подключены</div>
    <p class="eyebrow">Морские прогулки на Камчатке</p>
    <h1>Выберите день для поездки</h1>
    <p class="booking-intro">Расписание настраивает менеджер. Выберите дату, чтобы посмотреть рейсы и места.</p>
    <div class="booking-layout">
      <div class="calendar-panel">
        <div class="calendar-heading">
          <button type="button" aria-label="Предыдущий месяц" @click="moveMonth(-1)">‹</button>
          <h2>{{ title }}</h2>
          <button type="button" aria-label="Следующий месяц" @click="moveMonth(1)">›</button>
        </div>
        <p v-if="loading" role="status" class="weather">Загружаем расписание…</p>
        <div v-else-if="loadError" role="alert" class="weather">Не удалось загрузить расписание. <button type="button" class="retry" @click="loadMonth">Повторить</button></div>
        <template v-else>
          <div class="calendar-grid weekdays" aria-hidden="true"><span v-for="day in weekdays" :key="day">{{ day }}</span></div>
          <div class="calendar-grid dates">
            <template v-for="(day, index) in cells" :key="index">
              <span v-if="!day" class="empty-cell" />
              <button v-else type="button" :class="['date', calendarDayState(dayRows(day)), { selected: selected === day }]" :aria-label="dayDescription(day)" :aria-pressed="selected === day" @click="selectDay(day)">
                <span>{{ day }}</span><span class="route-icon" aria-hidden="true">{{ dayRows(day).filter(row => row.open && row.trip?.upcoming && row.trip.kind === 'shared').length > 1 ? '≡' : dayRows(day).find(row => row.open && row.trip?.upcoming && row.trip.kind === 'shared')?.trip?.route ? icons[dayRows(day).find(row => row.open && row.trip?.upcoming && row.trip.kind === 'shared')!.trip!.route!] : calendarDayState(dayRows(day)) !== 'closed' ? '?' : '—' }}</span>
              </button>
            </template>
          </div>
          <div class="legend"><span><i class="dot empty" /> Нет записавшихся</span><span><i class="dot available" /> Есть места</span><span><i class="dot full" /> Мест нет</span></div>
          <p class="icon-legend">▴ Бухта Русская &nbsp; · &nbsp; ◭ Старичков &nbsp; · &nbsp; ≈ Рыбалка &nbsp; · &nbsp; ? Маршрут не выбран &nbsp; · &nbsp; ≡ Несколько рейсов</p>
        </template>
      </div>
      <aside class="day-panel" aria-live="polite">
        <template v-if="selected !== null">
          <p class="day-label">Выбранный день</p><h2>{{ selectedTitle }}</h2>
          <template v-if="availableTrips.length">
            <div v-if="availableTrips.length > 1" class="trip-options" aria-label="Рейсы в выбранный день">
              <button v-for="row in availableTrips" :key="row.trip!.id" type="button" :class="{ active: selectedTrip === row.trip!.id }" :aria-pressed="selectedTrip === row.trip!.id" @click="selectTrip(row.trip!.id)">{{ row.trip!.startsAt }} · {{ row.trip!.route ? routeNames[row.trip!.route] : 'Маршрут не выбран' }}</button>
            </div>
            <template v-if="active?.trip">
              <h3>{{ active.trip.route ? routeNames[active.trip.route] : 'Маршрут ещё не выбран' }}</h3>
              <p class="status">Начало {{ active.trip.startsAt }} · записано {{ active.trip.booked }} из {{ active.capacity }}</p>
              <p v-if="active.trip.held" class="weather">Мест временно удержано: {{ active.trip.held }}</p>
              <p class="status">Свободно мест: {{ active.trip.available }}</p>
              <template v-if="!active.trip.route && !active.trip.routeSelecting && active.trip.available > 0">
                <label for="booking-route">Выберите маршрут</label>
                <select id="booking-route" v-model="chosenRoute"><option value="">Выбрать маршрут</option><option v-for="route in routes" :key="route" :value="route">{{ routeNames[route] }}</option></select>
              </template>
              <p v-if="active.trip.routeSelecting" class="weather">Другой гость сейчас выбирает маршрут. Проверьте расписание позже.</p>
              <div class="trip-status"><span>Статус рейса</span><strong>{{ active.trip.confirmation === 'confirmed' ? 'Подтверждён' : 'Ожидает подтверждения' }}</strong></div>
              <p class="weather">Выход зависит от погоды и решения капитана.</p>
              <template v-if="active.trip.available > 0 && !active.trip.routeSelecting">
                <label for="booking-guests">Количество гостей</label>
                <select id="booking-guests" v-model.number="guestCount"><option v-for="n in active.trip.available" :key="n" :value="n">{{ n }}</option></select>
                <button class="preview-pay" type="button" disabled>Перейти к оплате</button>
                <p class="weather">Оплата появится после подключения системы.</p>
              </template>
              <p v-else-if="!active.trip.routeSelecting" class="weather">Свободных мест сейчас нет.</p>
            </template>
          </template>
          <p v-else class="weather">{{ selectedRows.some(row => row.open && !row.trip) ? 'Менеджер открыл день, но пока не назначил время рейса.' : 'На эту дату продажа мест пока не открыта.' }}</p>
        </template>
        <p v-else class="weather">Выберите дату в календаре.</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.booking-preview{padding-top:40px;padding-bottom:100px;max-width:1320px}.preview-note{padding:12px 16px;margin-bottom:42px;border:1px solid #775c2f;border-radius:8px;color:#f4d497;background:#342a17;font-size:14px}.eyebrow{color:var(--gold);font-weight:700;text-transform:uppercase;font-size:13px;letter-spacing:.08em}.booking-preview h1{font-size:clamp(32px,4vw,52px);line-height:1.1;margin:12px 0}.booking-intro,.weather,.day-label,.icon-legend{color:var(--muted)}.booking-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,.8fr);gap:20px;margin-top:32px}.calendar-panel,.day-panel{border:1px solid #244155;background:#0a1a27;border-radius:16px;padding:24px}.calendar-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}.calendar-heading h2{text-transform:capitalize;font-size:22px;margin:0}.calendar-heading button{border:1px solid #355061;border-radius:8px;background:#152c3b;color:white;font-size:28px;width:44px;height:44px;cursor:pointer}.calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.weekdays{color:var(--muted);text-align:center;font-weight:700;font-size:13px;margin-bottom:10px}.date{min-width:0;min-height:72px;border:1px solid #344451;border-radius:8px;text-align:left;padding:8px;color:white;background:#12202b;display:flex;flex-direction:column;align-items:flex-start;gap:2px;cursor:pointer}.date span:first-child{font-size:16px;font-weight:700}.date small{font-size:11px;color:#e2e8ec}.date .route-icon{font-size:18px;line-height:1;color:#f3d28e}.date.empty,.dot.empty{background:#43505a}.date.available,.dot.available{background:#70531d}.date.full,.dot.full{background:#74343c}.date.closed{opacity:.45}.date.selected{outline:2px solid var(--gold);outline-offset:2px}.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;margin-top:22px}.legend span{display:flex;align-items:center;gap:6px}.dot{width:10px;height:10px;border-radius:50%}.icon-legend{font-size:12px;margin:14px 0 0}.day-label{font-size:13px;margin:0}.day-panel h2{font-size:30px;margin:4px 0 22px}.day-panel h3{font-size:21px;margin:0 0 10px}.status{color:#f0c879}.trip-status{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;border-top:1px solid #34505c;margin-top:24px;padding-top:20px}.trip-status strong{color:#99dfbb}.day-panel label{display:block;font-weight:700;font-size:14px;margin-top:20px;margin-bottom:8px}.day-panel select{width:100%;border:1px solid #557080;border-radius:8px;background:#102635;color:white;padding:12px;font:inherit}.preview-pay{width:100%;padding:15px;margin-top:22px;background:var(--crab);color:white;font-weight:700;border:0;border-radius:8px;opacity:.55}.weather{font-size:14px}.preview-pay+ .weather{font-size:12px}@media(max-width:760px){.booking-preview{padding-top:22px}.preview-note{margin-bottom:28px}.booking-layout{grid-template-columns:1fr}.calendar-panel,.day-panel{padding:16px}.calendar-grid{gap:4px}.date{min-height:60px;padding:5px}.date span:first-child{font-size:14px}.date .route-icon{font-size:15px}.date small{font-size:10px}.legend{gap:10px;font-size:11px}}
</style>

<style scoped>
.calendar-heading h2{text-transform:none}.retry{background:none;border:0;color:var(--gold);text-decoration:underline;cursor:pointer;font:inherit}.trip-options{display:grid;gap:8px;margin-bottom:20px}.trip-options button{background:#132b3a;border:1px solid #4a6270;border-radius:8px;color:white;padding:10px;text-align:left;cursor:pointer}.trip-options button.active{border-color:var(--gold)}
</style>

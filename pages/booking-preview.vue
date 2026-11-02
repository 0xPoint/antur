<script setup lang="ts">
import { calendarCells, occupancy, routeNames, type CalendarDay, type RouteId } from '~/utils/booking-calendar'

useHead({ title: 'Календарь бронирования — предварительный просмотр', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })
const year = ref(2027)
const month = ref(7)
const selected = ref(15)
const chosenRoute = ref<RouteId | ''>('')
const guestCount = ref(2)
const routes: RouteId[] = ['russkaya', 'starichkov', 'fishing']
const icons: Record<RouteId, string> = { russkaya: '▴', starichkov: '◭', fishing: '≈' }
const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const demoDays: Record<number, CalendarDay> = {
  2: { date: '2027-07-02', open: true, route: 'fishing', occupied: 4, confirmation: 'pending' },
  6: { date: '2027-07-06', open: true, route: null, occupied: 0, confirmation: 'pending' },
  10: { date: '2027-07-10', open: true, route: 'starichkov', occupied: 11, confirmation: 'confirmed' },
  15: { date: '2027-07-15', open: true, route: 'russkaya', occupied: 6, confirmation: 'confirmed' },
  18: { date: '2027-07-18', open: true, route: null, occupied: 0, confirmation: 'pending' },
  21: { date: '2027-07-21', open: true, route: 'starichkov', occupied: 3, confirmation: 'pending' }
}
const cells = computed(() => calendarCells(year.value, month.value))
const title = computed(() => new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year.value, month.value - 1, 1))))
const dayFor = (day: number) => year.value === 2027 && month.value === 7 ? demoDays[day] : undefined
const active = computed(() => dayFor(selected.value))
const selectedTitle = computed(() => new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(year.value, month.value - 1, selected.value))))
const stateLabel = (day: CalendarDay) => ({ empty: 'Нет записавшихся', available: 'Есть места', full: 'Мест нет' })[occupancy(day.occupied)]
function selectDay(day: number) { selected.value = day; chosenRoute.value = ''; guestCount.value = Math.min(2, 11 - (dayFor(day)?.occupied || 0)) }
function moveMonth(step: number) {
  const next = new Date(Date.UTC(year.value, month.value - 1 + step, 1))
  year.value = next.getUTCFullYear(); month.value = next.getUTCMonth() + 1; selected.value = 1; chosenRoute.value = ''
}
</script>

<template>
  <section class="booking-preview container">
    <div class="preview-note" role="note">Предварительный просмотр · даты и места показаны для примера, бронирование пока недоступно</div>
    <p class="eyebrow">Морские прогулки на Камчатке</p>
    <h1>Выберите день для поездки</h1>
    <p class="booking-intro">Выберите дату, чтобы посмотреть маршрут и свободные места.</p>
    <div class="booking-layout">
      <div class="calendar-panel">
        <div class="calendar-heading">
          <button type="button" aria-label="Предыдущий месяц" @click="moveMonth(-1)">‹</button>
          <h2>{{ title }}</h2>
          <button type="button" aria-label="Следующий месяц" @click="moveMonth(1)">›</button>
        </div>
        <div class="calendar-grid weekdays" aria-hidden="true"><span v-for="day in weekdays" :key="day">{{ day }}</span></div>
        <div class="calendar-grid dates">
          <template v-for="(day, index) in cells" :key="index">
            <span v-if="!day" class="empty-cell" />
            <button v-else type="button" :class="['date', dayFor(day) ? occupancy(dayFor(day)!.occupied) : 'closed', { selected: selected === day }]" :aria-label="`${day} ${title}, ${dayFor(day) ? `${stateLabel(dayFor(day)!)}, ${dayFor(day)!.route ? routeNames[dayFor(day)!.route!] : 'маршрут не выбран'}` : 'продажа не открыта'}`" :aria-pressed="selected === day" @click="selectDay(day)">
              <span>{{ day }}</span><span class="route-icon" aria-hidden="true">{{ dayFor(day)?.route ? icons[dayFor(day)!.route!] : dayFor(day) ? '?' : '—' }}</span>
              <small v-if="dayFor(day)">{{ dayFor(day)!.occupied }}/11</small>
            </button>
          </template>
        </div>
        <div class="legend"><span><i class="dot empty" /> Нет записавшихся</span><span><i class="dot available" /> Есть места</span><span><i class="dot full" /> Мест нет</span></div>
        <p class="icon-legend">▴ Бухта Русская &nbsp; · &nbsp; ◭ Старичков &nbsp; · &nbsp; ≈ Рыбалка &nbsp; · &nbsp; ? Маршрут не выбран</p>
      </div>
      <aside class="day-panel" aria-live="polite">
        <p class="day-label">Выбранный день</p>
        <h2>{{ selectedTitle }}</h2>
        <template v-if="active">
          <h3>{{ active.route ? routeNames[active.route] : 'Маршрут ещё не выбран' }}</h3>
          <p class="status">{{ stateLabel(active) }} · {{ active.occupied }} из 11</p>
          <template v-if="!active.route">
            <label for="booking-route">Выберите маршрут</label>
            <select id="booking-route" v-model="chosenRoute"><option value="">Выбрать маршрут</option><option v-for="route in routes" :key="route" :value="route">{{ routeNames[route] }}</option></select>
          </template>
          <div class="trip-status"><span>Статус рейса</span><strong>{{ active.confirmation === 'confirmed' ? 'Подтверждён' : 'Ожидает подтверждения' }}</strong></div>
          <p class="weather">Выход зависит от погоды и решения капитана.</p>
          <template v-if="active.occupied < 11">
            <label for="booking-guests">Количество гостей</label>
            <select id="booking-guests" v-model.number="guestCount"><option v-for="n in 11 - active.occupied" :key="n" :value="n">{{ n }}</option></select>
            <button class="preview-pay" type="button" disabled>Перейти к оплате</button>
            <p class="weather">Оплата появится после подключения системы.</p>
          </template>
        </template>
        <p v-else class="weather">Продажа на этот день пока не открыта. Менеджер настраивает календарь заранее.</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.booking-preview{padding-top:40px;padding-bottom:100px;max-width:1320px}.preview-note{padding:12px 16px;margin-bottom:42px;border:1px solid #775c2f;border-radius:8px;color:#f4d497;background:#342a17;font-size:14px}.eyebrow{color:var(--gold);font-weight:700;text-transform:uppercase;font-size:13px;letter-spacing:.08em}.booking-preview h1{font-size:clamp(32px,4vw,52px);line-height:1.1;margin:12px 0}.booking-intro,.weather,.day-label,.icon-legend{color:var(--muted)}.booking-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(300px,.8fr);gap:20px;margin-top:32px}.calendar-panel,.day-panel{border:1px solid #244155;background:#0a1a27;border-radius:16px;padding:24px}.calendar-heading{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px}.calendar-heading h2{text-transform:capitalize;font-size:22px;margin:0}.calendar-heading button{border:1px solid #355061;border-radius:8px;background:#152c3b;color:white;font-size:28px;width:44px;height:44px;cursor:pointer}.calendar-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}.weekdays{color:var(--muted);text-align:center;font-weight:700;font-size:13px;margin-bottom:10px}.date{min-width:0;min-height:72px;border:1px solid #344451;border-radius:8px;text-align:left;padding:8px;color:white;background:#12202b;display:flex;flex-direction:column;align-items:flex-start;gap:2px;cursor:pointer}.date span:first-child{font-size:16px;font-weight:700}.date small{font-size:11px;color:#e2e8ec}.date .route-icon{font-size:18px;line-height:1;color:#f3d28e}.date.empty,.dot.empty{background:#43505a}.date.available,.dot.available{background:#70531d}.date.full,.dot.full{background:#74343c}.date.closed{opacity:.45}.date.selected{outline:2px solid var(--gold);outline-offset:2px}.legend{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;margin-top:22px}.legend span{display:flex;align-items:center;gap:6px}.dot{width:10px;height:10px;border-radius:50%}.icon-legend{font-size:12px;margin:14px 0 0}.day-label{font-size:13px;margin:0}.day-panel h2{font-size:30px;margin:4px 0 22px}.day-panel h3{font-size:21px;margin:0 0 10px}.status{color:#f0c879}.trip-status{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;border-top:1px solid #34505c;margin-top:24px;padding-top:20px}.trip-status strong{color:#99dfbb}.day-panel label{display:block;font-weight:700;font-size:14px;margin-top:20px;margin-bottom:8px}.day-panel select{width:100%;border:1px solid #557080;border-radius:8px;background:#102635;color:white;padding:12px;font:inherit}.preview-pay{width:100%;padding:15px;margin-top:22px;background:var(--crab);color:white;font-weight:700;border:0;border-radius:8px;opacity:.55}.weather{font-size:14px}.preview-pay+ .weather{font-size:12px}@media(max-width:760px){.booking-preview{padding-top:22px}.preview-note{margin-bottom:28px}.booking-layout{grid-template-columns:1fr}.calendar-panel,.day-panel{padding:16px}.calendar-grid{gap:4px}.date{min-height:60px;padding:5px}.date span:first-child{font-size:14px}.date .route-icon{font-size:15px}.date small{font-size:10px}.legend{gap:10px;font-size:11px}}
</style>

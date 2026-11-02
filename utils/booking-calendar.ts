export type RouteId = 'russkaya' | 'starichkov' | 'fishing'
export type Occupancy = 'empty' | 'available' | 'full'
export type Confirmation = 'pending' | 'confirmed'

export interface CalendarDay {
  date: string
  open: boolean
  route: RouteId | null
  occupied: number
  confirmation: Confirmation
}

export const routeNames: Record<RouteId, string> = {
  russkaya: 'Бухта Русская',
  starichkov: 'Остров Старичков',
  fishing: 'Морская рыбалка'
}

export function occupancy(occupied: number, capacity = 11): Occupancy {
  if (!Number.isInteger(occupied) || !Number.isInteger(capacity) || capacity < 1 || occupied < 0 || occupied > capacity) {
    throw new RangeError('Invalid occupancy')
  }
  return occupied === 0 ? 'empty' : occupied === capacity ? 'full' : 'available'
}

export function confirmedAfterPayment(existing: Confirmation, paidGuests: number): Confirmation {
  if (!Number.isInteger(paidGuests) || paidGuests < 0 || paidGuests > 11) throw new RangeError('Invalid guest count')
  return existing === 'confirmed' || paidGuests >= 6 ? 'confirmed' : 'pending'
}

export function calendarCells(year: number, month: number): (number | null)[] {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate()
  return [...Array((firstDay + 6) % 7).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
}

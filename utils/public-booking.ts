import type { RouteId } from './booking-calendar.js'

export type PublicTrip = {
  id: string; route: RouteId | null; kind: 'shared' | 'private'; confirmation: 'pending' | 'confirmed'
  upcoming: boolean; startsAt: string; booked: number; held: number; available: number; routeSelecting: boolean
}
export type PublicDay = { date: string; open: boolean; capacity: number; trip: PublicTrip | null }

export function calendarDayState(rows: PublicDay[]): 'closed' | 'empty' | 'available' | 'full' {
  const options = rows.filter(row => row.open && row.trip?.upcoming && row.trip.kind === 'shared')
  if (!options.length) return 'closed'
  if (options.some(row => row.trip!.available > 0)) return options.every(row => row.trip!.booked === 0 && row.trip!.held === 0) ? 'empty' : 'available'
  return 'full'
}

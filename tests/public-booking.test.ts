import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calendarDayState, type PublicDay } from '../utils/public-booking.js'

const row = (trip: Partial<NonNullable<PublicDay['trip']>> = {}, open = true): PublicDay => ({
  date: '2027-07-15', open, capacity: 11,
  trip: { id: '1', route: null, kind: 'shared', confirmation: 'pending', upcoming: true, startsAt: '08:00', booked: 0, held: 0, available: 11, routeSelecting: false, ...trip }
})

test('calendar distinguishes closed days, empty trips, partial groups and full trips', () => {
  assert.equal(calendarDayState([]), 'closed')
  assert.equal(calendarDayState([row({}, false)]), 'closed')
  assert.equal(calendarDayState([row({ upcoming: false })]), 'closed')
  assert.equal(calendarDayState([row({ kind: 'private', available: 0 })]), 'closed')
  assert.equal(calendarDayState([row()]), 'empty')
  assert.equal(calendarDayState([row({ booked: 6, available: 5 })]), 'available')
  assert.equal(calendarDayState([row({ booked: 10, held: 1, available: 0 })]), 'full')
  assert.equal(calendarDayState([row({ booked: 11, available: 0 }), row()]), 'available')
})

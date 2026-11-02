import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calendarCells, confirmedAfterPayment, occupancy } from '../utils/booking-calendar.js'

test('occupancy distinguishes empty, open and full', () => {
  assert.equal(occupancy(0), 'empty')
  assert.equal(occupancy(6), 'available')
  assert.equal(occupancy(11), 'full')
  assert.throws(() => occupancy(12))
})

test('confirmation is independent from occupancy and is not revoked automatically', () => {
  assert.equal(confirmedAfterPayment('pending', 5), 'pending')
  assert.equal(confirmedAfterPayment('pending', 6), 'confirmed')
  assert.equal(confirmedAfterPayment('confirmed', 3), 'confirmed')
})

test('calendar aligns July 2027 to Thursday and supports leap years', () => {
  assert.deepEqual(calendarCells(2027, 7).slice(0, 5), [null, null, null, 1, 2])
  assert.equal(calendarCells(2028, 2).filter(Boolean).length, 29)
})

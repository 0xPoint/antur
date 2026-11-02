// Run only against a dedicated, empty local test database with the migration applied.
import assert from 'node:assert/strict'
import pg from 'pg'
import { createHold, markVerifiedPayment } from '../server/database/booking/reservations.ts'
import { saveMonth } from '../server/database/booking/schedule.ts'
import { getMonthAvailability } from '../server/database/booking/availability.ts'

if (process.env.PGDATABASE !== 'antur_booking_dev_check') throw new Error('Refusing to modify a database other than antur_booking_dev_check')
const pool = new pg.Pool()
try {
  const boat = await pool.query("INSERT INTO boats(name,capacity) VALUES('test',11) RETURNING id")
  const day = await pool.query("INSERT INTO booking_days(boat_id,day,is_open) VALUES($1,'2027-07-15',true) RETURNING id", [boat.rows[0].id])
  const trip = await pool.query("INSERT INTO trips(day_id,boat_id,starts_at,ends_at) VALUES($1,$2,'2027-07-14T20:00Z','2027-07-15T04:00Z') RETURNING id", [day.rows[0].id, boat.rows[0].id])
  const tripId = trip.rows[0].id
  const request = (guests, route = 'russkaya') => createHold(pool, { tripId, route, guests, name: 'Test', phone: 'test' })
  const contenders = await Promise.allSettled([request(6), request(6)])
  assert.equal(contenders.filter(item => item.status === 'fulfilled').length, 1, 'concurrent holds must not oversell')
  const hold = contenders.find(item => item.status === 'fulfilled').value
  await assert.rejects(request(1, 'fishing'), /ROUTE_CONFLICT/)
  assert.equal(await markVerifiedPayment(pool, hold.id), 'paid')
  assert.equal(await markVerifiedPayment(pool, hold.id), 'paid')
  const status = await pool.query('SELECT confirmation, route FROM trips WHERE id=$1', [tripId])
  assert.deepEqual(status.rows[0], { confirmation: 'confirmed', route: 'russkaya' })
  const late = await request(1)
  const available = (await getMonthAvailability(pool, 2027, 7)).find(day => day.trip?.id === String(tripId))
  assert.equal(available.trip.startsAt, '08:00')
  assert.equal(available.trip.booked, 6)
  assert.equal(available.trip.available, 4)
  assert.equal(JSON.stringify(available).includes('test'), false, 'availability must not expose guest data')
  await pool.query("UPDATE bookings SET hold_expires_at=now()-interval '1 minute' WHERE id=$1", [late.id])
  assert.equal(await markVerifiedPayment(pool, late.id), 'payment_review')
  await saveMonth(pool, Number(boat.rows[0].id), 2027, 7, [1, 2, 15], 'test-manager', 0)
  const month = await pool.query('SELECT count(*)::int AS days, count(*) FILTER (WHERE is_open)::int AS open FROM booking_days WHERE boat_id=$1', [boat.rows[0].id])
  assert.deepEqual(month.rows[0], { days: 31, open: 3 })
  await assert.rejects(saveMonth(pool, Number(boat.rows[0].id), 2027, 7, [2], 'test-manager', 0), /MONTH_CONFLICT/)
  await saveMonth(pool, Number(boat.rows[0].id), 2027, 7, [1], 'test-manager', 1)
  await assert.rejects(request(1), /TRIP_UNAVAILABLE/)
  assert.equal((await pool.query('SELECT confirmation FROM trips WHERE id=$1', [tripId])).rows[0].confirmation, 'confirmed')
  console.log('Booking database checks passed: concurrent capacity, route, confirmation, duplicate and late payments.')
} finally { await pool.end() }

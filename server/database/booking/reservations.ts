import type { Pool, PoolClient } from 'pg'
import { randomUUID } from 'node:crypto'

export type BookingRoute = 'russkaya' | 'starichkov' | 'fishing'
type HoldInput = { tripId: number, route: BookingRoute, guests: number, name: string, phone: string }

async function transaction<T>(pool: Pool, work: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally { client.release() }
}

/** Holds seats while checkout is in progress; all competing writers lock the trip. */
export async function createHold(pool: Pool, input: HoldInput) {
  if (!Number.isInteger(input.guests) || input.guests < 1 || input.guests > 11 || !['russkaya', 'starichkov', 'fishing'].includes(input.route) || !input.name.trim() || !input.phone.trim()) throw new Error('INVALID_BOOKING')
  return transaction(pool, async client => {
    const tripResult = await client.query(`SELECT t.id, t.route, t.kind, t.confirmation, d.is_open, b.capacity
      FROM trips t JOIN booking_days d ON d.id=t.day_id JOIN boats b ON b.id=t.boat_id
      WHERE t.id=$1 FOR UPDATE OF t, d`, [input.tripId])
    const trip = tripResult.rows[0]
    if (!trip || !trip.is_open || trip.confirmation === 'cancelled' || trip.kind !== 'shared') throw new Error('TRIP_UNAVAILABLE')
    await client.query("UPDATE bookings SET status='expired' WHERE trip_id=$1 AND status='held' AND hold_expires_at <= now()", [input.tripId])
    const existing = await client.query("SELECT route, COALESCE(SUM(guests),0)::int AS guests FROM bookings WHERE trip_id=$1 AND status IN ('held','paid','manual_pending','manual_confirmed') GROUP BY route", [input.tripId])
    if ((trip.route && trip.route !== input.route) || existing.rows.some(row => row.route !== input.route)) throw new Error('ROUTE_CONFLICT')
    if (existing.rows.reduce((sum, row) => sum + row.guests, 0) + input.guests > trip.capacity) throw new Error('NOT_ENOUGH_SEATS')
    const id = randomUUID()
    const inserted = await client.query(`INSERT INTO bookings(id, trip_id, guests, route, name, phone, status, hold_expires_at)
      VALUES($1,$2,$3,$4,$5,$6,'held',now()+interval '20 minutes') RETURNING id, hold_expires_at`, [id, input.tripId, input.guests, input.route, input.name.trim(), input.phone.trim()])
    await client.query('UPDATE trips SET revision=revision+1 WHERE id=$1', [input.tripId])
    return inserted.rows[0] as { id: string, hold_expires_at: Date }
  })
}

/** Call only after verifying the payment with the provider and checking its amount. */
export async function markVerifiedPayment(pool: Pool, bookingId: string) {
  return transaction(pool, async client => {
    const ref = await client.query('SELECT trip_id FROM bookings WHERE id=$1', [bookingId])
    if (!ref.rowCount) throw new Error('BOOKING_NOT_FOUND')
    const tripId = ref.rows[0].trip_id
    const trip = await client.query('SELECT route, confirmation FROM trips WHERE id=$1 FOR UPDATE', [tripId])
    const result = await client.query('SELECT *, (hold_expires_at > now()) AS hold_valid FROM bookings WHERE id=$1 FOR UPDATE', [bookingId])
    const booking = result.rows[0]
    if (booking.status === 'paid') return 'paid'
    if (booking.status !== 'held' || !booking.hold_valid || trip.rows[0].confirmation === 'cancelled' || (trip.rows[0].route && trip.rows[0].route !== booking.route)) {
      await client.query("UPDATE bookings SET status=CASE WHEN status IN ('held','expired') THEN 'payment_review' ELSE status END, payment_source='online', refund_review=true WHERE id=$1", [bookingId])
      await client.query('UPDATE trips SET revision=revision+1 WHERE id=$1', [tripId])
      return 'payment_review'
    }
    await client.query("UPDATE bookings SET status='paid',payment_source='online' WHERE id=$1", [bookingId])
    await client.query('UPDATE trips SET route=COALESCE(route,$2),revision=revision+1 WHERE id=$1', [tripId, booking.route])
    const count = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND status IN ('paid','manual_confirmed')", [tripId])
    if (count.rows[0].count >= 6) await client.query("UPDATE trips SET confirmation='confirmed', confirmed_at=COALESCE(confirmed_at,now()) WHERE id=$1 AND confirmation='pending'", [tripId])
    return 'paid'
  })
}

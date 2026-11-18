import { randomUUID } from 'node:crypto'
import type { Pool, PoolClient } from 'pg'

type Input = Record<string, unknown>
const routes = ['russkaya', 'starichkov', 'fishing']
const datePattern = /^20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !datePattern.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
}
function positiveId(value: unknown): value is number { return Number.isSafeInteger(value) && Number(value) > 0 }
function text(value: unknown, max: number): value is string { return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max }
function validPhone(value: unknown): value is string { return text(value, 40) && /^\+?[\d\s()-]+$/.test(value.trim()) && value.replace(/\D/g, '').length >= 10 && value.replace(/\D/g, '').length <= 15 }
function validTime(value: unknown): value is string { return typeof value === 'string' && timePattern.test(value) }
async function audit(client: PoolClient, actor: string, action: string, type: string, id: string, details: object = {}) {
  await client.query('INSERT INTO booking_audit(actor,action,entity_type,entity_id,details) VALUES($1,$2,$3,$4,$5::jsonb)', [actor, action, type, id, JSON.stringify(details)])
}
async function tripLocked(client: PoolClient, id: unknown, revision: unknown, allowCancelled = false) {
  if (!positiveId(id) || !Number.isSafeInteger(revision) || Number(revision) < 0) throw new Error('INVALID_INPUT')
  const result = await client.query('SELECT t.*, b.capacity FROM trips t JOIN boats b ON b.id=t.boat_id WHERE t.id=$1 FOR UPDATE OF t', [id])
  const trip = result.rows[0]
  if (!trip) throw new Error('NOT_FOUND')
  if (trip.revision !== revision) throw new Error('STALE_TRIP')
  if (trip.confirmation === 'cancelled' && !allowCancelled) throw new Error('TRIP_CANCELLED')
  return trip
}
async function bump(client: PoolClient, tripId: number) { await client.query('UPDATE trips SET revision=revision+1 WHERE id=$1', [tripId]) }

/** All seat-changing actions lock the same trip row as online reservations. */
export async function performManagerOperation(pool: Pool, actor: string, input: Input) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    let result: object = { ok: true }
    if (input.action === 'createTrip') {
      if (!positiveId(input.boatId) || !validDate(input.date) || !validTime(input.start) || !validTime(input.end) || input.end <= input.start || !(input.route === null || (typeof input.route === 'string' && routes.includes(input.route))) || !['shared','private'].includes(String(input.kind))) throw new Error('INVALID_INPUT')
      const boat = await client.query('SELECT id FROM boats WHERE id=$1 FOR UPDATE', [input.boatId])
      if (!boat.rowCount) throw new Error('NOT_FOUND')
      const day = await client.query('INSERT INTO booking_days(boat_id,day,is_open) VALUES($1,$2,false) ON CONFLICT(boat_id,day) DO UPDATE SET day=excluded.day RETURNING id', [input.boatId, input.date])
      const added = await client.query(`INSERT INTO trips(day_id,boat_id,starts_at,ends_at,route,kind) VALUES($1,$2,($3||' '||$4)::timestamp AT TIME ZONE 'Asia/Kamchatka',($3||' '||$5)::timestamp AT TIME ZONE 'Asia/Kamchatka',$6,$7) RETURNING id::text`, [day.rows[0].id,input.boatId,input.date,input.start,input.end,input.route,input.kind])
      result = { ok: true, id: added.rows[0].id }
      await audit(client,actor,'create_trip','trip',added.rows[0].id,{ date: input.date, route: input.route, kind: input.kind })
    } else if (input.action === 'transferBooking') {
      if (!positiveId(input.tripId) || !positiveId(input.targetTripId) || input.tripId === input.targetTripId || !Number.isSafeInteger(input.revision) || !Number.isSafeInteger(input.targetRevision) || typeof input.bookingId !== 'string' || !uuidPattern.test(input.bookingId) || input.guestAgreed !== true) throw new Error('INVALID_INPUT')
      const locked = await client.query('SELECT t.*,b.capacity FROM trips t JOIN boats b ON b.id=t.boat_id WHERE t.id=ANY($1::bigint[]) ORDER BY t.id FOR UPDATE OF t', [[input.tripId,input.targetTripId]])
      const source = locked.rows.find(row => Number(row.id) === input.tripId)
      const target = locked.rows.find(row => Number(row.id) === input.targetTripId)
      if (!source || !target) throw new Error('NOT_FOUND')
      if (source.revision !== input.revision || target.revision !== input.targetRevision) throw new Error('STALE_TRIP')
      if (source.confirmation === 'cancelled' || target.confirmation === 'cancelled' || !target.route) throw new Error('TRIP_UNAVAILABLE')
      if (source.kind !== target.kind) throw new Error('INCOMPATIBLE_FORMAT')
      const found = await client.query('SELECT * FROM bookings WHERE id=$1 AND trip_id=$2 FOR UPDATE',[input.bookingId,input.tripId])
      const booking = found.rows[0]
      if (!booking || !['paid','manual_pending','manual_confirmed'].includes(booking.status) || booking.refund_review) throw new Error('BOOKING_UNAVAILABLE')
      const counts = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND (status IN ('paid','manual_pending','manual_confirmed') OR (status='held' AND hold_expires_at>now()))",[input.targetTripId])
      if (counts.rows[0].count + booking.guests > target.capacity || (target.kind === 'private' && counts.rows[0].count > 0)) throw new Error('NOT_ENOUGH_SEATS')
      await client.query('UPDATE bookings SET trip_id=$2,route=$3 WHERE id=$1',[input.bookingId,input.targetTripId,target.route])
      await client.query('UPDATE trips SET revision=revision+1 WHERE id=ANY($1::bigint[])',[[input.tripId,input.targetTripId]])
      const paid = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND status IN ('paid','manual_confirmed')", [input.targetTripId])
      if (target.kind === 'shared' && paid.rows[0].count >= 6) await client.query("UPDATE trips SET confirmation='confirmed',confirmed_at=COALESCE(confirmed_at,now()) WHERE id=$1 AND confirmation='pending'",[input.targetTripId])
      await audit(client,actor,'transfer_booking','booking',input.bookingId,{ fromTrip: input.tripId, toTrip: input.targetTripId, guestAgreed: true })
    } else {
      const trip = await tripLocked(client,input.tripId,input.revision,input.action === 'resolveRefund')
      const tripId = Number(trip.id)
      if (input.action === 'addGuest') {
        if (!text(input.name,120) || !validPhone(input.phone) || !Number.isInteger(input.guests) || Number(input.guests) < 1 || Number(input.guests) > 11 || !Number.isSafeInteger(input.paymentKopecks) || Number(input.paymentKopecks) < 0 || Number(input.paymentKopecks) > 100000000) throw new Error('INVALID_INPUT')
        if (!trip.route) throw new Error('ROUTE_REQUIRED')
        const counts = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND (status IN ('paid','manual_pending','manual_confirmed') OR (status='held' AND hold_expires_at>now()))", [tripId])
        if (counts.rows[0].count + Number(input.guests) > trip.capacity || (trip.kind === 'private' && counts.rows[0].count > 0)) throw new Error('NOT_ENOUGH_SEATS')
        const id = randomUUID()
        const requiredDeposit = trip.kind === 'private' ? 2000000 : 100000 * Number(input.guests)
        const status = Number(input.paymentKopecks) >= requiredDeposit ? 'manual_confirmed' : 'manual_pending'
        await client.query('INSERT INTO bookings(id,trip_id,guests,route,name,phone,status,manual_payment_kopecks) VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [id,tripId,input.guests,trip.route,input.name.trim(),input.phone.trim(),status,input.paymentKopecks])
        const paid = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND status IN ('paid','manual_confirmed')", [tripId])
        if (trip.kind === 'shared' && paid.rows[0].count >= 6) await client.query("UPDATE trips SET confirmation='confirmed', confirmed_at=COALESCE(confirmed_at,now()) WHERE id=$1 AND confirmation='pending'", [tripId])
        await bump(client,tripId); await audit(client,actor,'add_guest','booking',id,{ guests: input.guests, paymentKopecks: input.paymentKopecks })
      } else if (input.action === 'updateGuest') {
        if (typeof input.bookingId !== 'string' || !uuidPattern.test(input.bookingId) || !text(input.name,120) || !validPhone(input.phone) || !Number.isInteger(input.guests) || Number(input.guests) < 1 || Number(input.guests) > 11 || !Number.isSafeInteger(input.paymentKopecks) || Number(input.paymentKopecks) < 0 || Number(input.paymentKopecks) > 100000000) throw new Error('INVALID_INPUT')
        const found = await client.query('SELECT status,guests,manual_payment_kopecks FROM bookings WHERE id=$1 AND trip_id=$2 FOR UPDATE',[input.bookingId,tripId])
        if (!found.rowCount || !['manual_pending','manual_confirmed'].includes(found.rows[0].status)) throw new Error('BOOKING_UNAVAILABLE')
        if (Number(input.paymentKopecks) < found.rows[0].manual_payment_kopecks || (Number(input.guests) < found.rows[0].guests && found.rows[0].manual_payment_kopecks > 0)) throw new Error('PAYMENT_REVIEW_REQUIRED')
        const counts = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND id<>$2 AND (status IN ('paid','manual_pending','manual_confirmed') OR (status='held' AND hold_expires_at>now()))",[tripId,input.bookingId])
        if (counts.rows[0].count + Number(input.guests) > trip.capacity) throw new Error('NOT_ENOUGH_SEATS')
        const requiredDeposit = trip.kind === 'private' ? 2000000 : 100000 * Number(input.guests)
        const status = Number(input.paymentKopecks) >= requiredDeposit ? 'manual_confirmed' : 'manual_pending'
        await client.query('UPDATE bookings SET name=$2,phone=$3,guests=$4,manual_payment_kopecks=$5,status=$6 WHERE id=$1',[input.bookingId,input.name.trim(),input.phone.trim(),input.guests,input.paymentKopecks,status])
        const paid = await client.query("SELECT COALESCE(SUM(guests),0)::int AS count FROM bookings WHERE trip_id=$1 AND status IN ('paid','manual_confirmed')", [tripId])
        if (trip.kind === 'shared' && paid.rows[0].count >= 6) await client.query("UPDATE trips SET confirmation='confirmed', confirmed_at=COALESCE(confirmed_at,now()) WHERE id=$1 AND confirmation='pending'", [tripId])
        await bump(client,tripId); await audit(client,actor,'update_guest','booking',input.bookingId,{ guests: input.guests, paymentKopecks: input.paymentKopecks })
      } else if (input.action === 'reduceGuests') {
        if (typeof input.bookingId !== 'string' || !uuidPattern.test(input.bookingId) || !Number.isInteger(input.guests) || Number(input.guests) < 1 || input.paymentAcknowledged !== true) throw new Error('INVALID_INPUT')
        const found = await client.query('SELECT status,guests,manual_payment_kopecks FROM bookings WHERE id=$1 AND trip_id=$2 FOR UPDATE',[input.bookingId,tripId])
        const booking = found.rows[0]
        if (!booking || !['paid','manual_pending','manual_confirmed'].includes(booking.status) || Number(input.guests) >= booking.guests) throw new Error('BOOKING_UNAVAILABLE')
        const review = booking.status === 'paid' || booking.manual_payment_kopecks > 0
        await client.query('UPDATE bookings SET guests=$2,refund_review=refund_review OR $3,refund_note=CASE WHEN $3 THEN NULL ELSE refund_note END,refund_reviewed_at=CASE WHEN $3 THEN NULL ELSE refund_reviewed_at END WHERE id=$1',[input.bookingId,input.guests,review])
        await bump(client,tripId); await audit(client,actor,'reduce_guests','booking',input.bookingId,{ previousGuests: booking.guests, guests: input.guests, refundReview: review })
      } else if (input.action === 'cancelBooking') {
        if (typeof input.bookingId !== 'string' || !uuidPattern.test(input.bookingId)) throw new Error('INVALID_INPUT')
        const found = await client.query('SELECT status,manual_payment_kopecks FROM bookings WHERE id=$1 AND trip_id=$2 FOR UPDATE',[input.bookingId,tripId])
        const booking = found.rows[0]
        if (!booking || !['paid','manual_pending','manual_confirmed'].includes(booking.status)) throw new Error('BOOKING_UNAVAILABLE')
        const review = booking.status === 'paid' || booking.manual_payment_kopecks > 0
        if (review && input.paymentAcknowledged !== true) throw new Error('PAYMENT_REVIEW_REQUIRED')
        await client.query("UPDATE bookings SET status='cancelled', refund_review=refund_review OR $2, refund_note=CASE WHEN $2 THEN NULL ELSE refund_note END, refund_reviewed_at=CASE WHEN $2 THEN NULL ELSE refund_reviewed_at END WHERE id=$1",[input.bookingId,review])
        await bump(client,tripId); await audit(client,actor,'cancel_booking','booking',input.bookingId,{ refundReview: review })
      } else if (input.action === 'resolveRefund') {
        if (typeof input.bookingId !== 'string' || !uuidPattern.test(input.bookingId) || !text(input.note,500) || !Number.isSafeInteger(input.refundKopecks) || Number(input.refundKopecks) < 0 || input.manuallyVerified !== true) throw new Error('INVALID_INPUT')
        const found = await client.query('SELECT refund_review,status,guests,manual_payment_kopecks,payment_source FROM bookings WHERE id=$1 AND trip_id=$2 FOR UPDATE',[input.bookingId,tripId])
        if (!found.rowCount || !found.rows[0].refund_review) throw new Error('BOOKING_UNAVAILABLE')
        const booking = found.rows[0]
        if (booking.payment_source === 'online') throw new Error('REFUND_PROVIDER_UNAVAILABLE')
        if (Number(input.refundKopecks) > booking.manual_payment_kopecks) throw new Error('INVALID_INPUT')
        const remaining = booking.manual_payment_kopecks - Number(input.refundKopecks)
        const requiredDeposit = trip.kind === 'private' ? 2000000 : 100000 * booking.guests
        const status = ['manual_pending','manual_confirmed'].includes(booking.status) ? (remaining >= requiredDeposit ? 'manual_confirmed' : 'manual_pending') : booking.status
        await client.query('UPDATE bookings SET refund_review=false, refund_note=$2, refund_reviewed_at=now(),manual_payment_kopecks=$3,status=$4 WHERE id=$1',[input.bookingId,input.note.trim(),remaining,status])
        await bump(client,tripId); await audit(client,actor,'resolve_refund_review','booking',input.bookingId,{ note: input.note.trim(), refundKopecks: input.refundKopecks, manuallyVerified: true })
      } else if (input.action === 'confirmTrip') {
        if (!trip.route) throw new Error('ROUTE_REQUIRED')
        await client.query("UPDATE trips SET confirmation='confirmed',confirmed_at=COALESCE(confirmed_at,now()) WHERE id=$1",[tripId])
        await bump(client,tripId); await audit(client,actor,'confirm_trip','trip',String(tripId))
      } else if (input.action === 'changeRoute') {
        if (typeof input.route !== 'string' || !routes.includes(input.route) || input.guestsAgreed !== true) throw new Error('INVALID_INPUT')
        const holds = await client.query("SELECT 1 FROM bookings WHERE trip_id=$1 AND status='held' AND hold_expires_at>now() LIMIT 1",[tripId])
        if (holds.rowCount) throw new Error('ACTIVE_CHECKOUT')
        await client.query('UPDATE trips SET route=$2,revision=revision+1 WHERE id=$1',[tripId,input.route])
        await client.query("UPDATE bookings SET route=$2 WHERE trip_id=$1 AND status IN ('paid','manual_pending','manual_confirmed')",[tripId,input.route])
        await audit(client,actor,'change_route','trip',String(tripId),{ previousRoute: trip.route, route: input.route, guestsAgreed: true })
      } else if (input.action === 'moveTrip') {
        if (!validDate(input.date) || !validTime(input.start) || !validTime(input.end) || input.end <= input.start || input.guestsAgreed !== true) throw new Error('INVALID_INPUT')
        const holds = await client.query("SELECT 1 FROM bookings WHERE trip_id=$1 AND status='held' AND hold_expires_at>now() LIMIT 1",[tripId])
        if (holds.rowCount) throw new Error('ACTIVE_CHECKOUT')
        const day = await client.query('INSERT INTO booking_days(boat_id,day,is_open) VALUES($1,$2,false) ON CONFLICT(boat_id,day) DO UPDATE SET day=excluded.day RETURNING id',[trip.boat_id,input.date])
        await client.query("UPDATE trips SET day_id=$2,starts_at=($3||' '||$4)::timestamp AT TIME ZONE 'Asia/Kamchatka',ends_at=($3||' '||$5)::timestamp AT TIME ZONE 'Asia/Kamchatka',revision=revision+1 WHERE id=$1",[tripId,day.rows[0].id,input.date,input.start,input.end])
        await audit(client,actor,'move_trip','trip',String(tripId),{ date: input.date, guestsAgreed: true })
      } else if (input.action === 'cancelTrip') {
        if (input.guestsNotified !== true) throw new Error('INVALID_INPUT')
        const holds = await client.query("SELECT 1 FROM bookings WHERE trip_id=$1 AND status='held' AND hold_expires_at>now() LIMIT 1",[tripId])
        if (holds.rowCount) throw new Error('ACTIVE_CHECKOUT')
        await client.query("UPDATE trips SET confirmation='cancelled',revision=revision+1 WHERE id=$1",[tripId])
        await client.query("UPDATE bookings SET refund_review=true,refund_note=NULL,refund_reviewed_at=NULL WHERE trip_id=$1 AND status IN ('paid','manual_pending','manual_confirmed') AND (status='paid' OR manual_payment_kopecks>0)",[tripId])
        await audit(client,actor,'cancel_trip','trip',String(tripId),{ guestsNotified: true })
      } else throw new Error('INVALID_INPUT')
    }
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === '23P01') throw new Error('TRIP_OVERLAP')
    throw error
  } finally { client.release() }
}

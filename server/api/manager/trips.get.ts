import { requireManager } from '../../utils/manager-auth'
import { bookingPool } from '../../utils/booking-db'

export default defineEventHandler(async event => {
  await requireManager(event)
  const query = getQuery(event)
  if (typeof query.month !== 'string' || !/^20\d\d-(0[1-9]|1[0-2])$/.test(query.month)) throw createError({ statusCode: 400, statusMessage: 'Invalid month' })
  const result = await bookingPool(useRuntimeConfig(event).bookingDatabaseUrl).query(`
    SELECT t.id::text, t.boat_id::text, t.route, t.kind, t.confirmation, t.revision,
      to_char(d.day,'YYYY-MM-DD') AS date,
      to_char(t.starts_at AT TIME ZONE 'Asia/Kamchatka','HH24:MI') AS start,
      to_char(t.ends_at AT TIME ZONE 'Asia/Kamchatka','HH24:MI') AS "end",
      b.capacity,
      COALESCE(json_agg(json_build_object('id',bk.id,'name',bk.name,'phone',bk.phone,'guests',bk.guests,'status',bk.status,'paymentKopecks',bk.manual_payment_kopecks,'refundReview',bk.refund_review,'refundNote',bk.refund_note) ORDER BY bk.created_at) FILTER (WHERE bk.id IS NOT NULL AND (bk.status NOT IN ('held','expired') OR (bk.status='held' AND bk.hold_expires_at>now()))),'[]') AS bookings
    FROM trips t JOIN booking_days d ON d.id=t.day_id JOIN boats b ON b.id=t.boat_id
    LEFT JOIN bookings bk ON bk.trip_id=t.id
    WHERE d.day >= $1::date AND d.day < ($1::date + interval '1 month')
    GROUP BY t.id,d.id,b.id ORDER BY t.starts_at`, [`${query.month}-01`])
  return { trips: result.rows }
})

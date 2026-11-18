import { requireManager } from '../../utils/manager-auth'
import { bookingPool } from '../../utils/booking-db'

export default defineEventHandler(async event => {
  await requireManager(event)
  const query = getQuery(event)
  if (typeof query.month !== 'string' || !/^20\d\d-(0[1-9]|1[0-2])$/.test(query.month)) throw createError({ statusCode: 400, statusMessage: 'Invalid month' })
  const client = await bookingPool(useRuntimeConfig(event).bookingDatabaseUrl).connect()
  try {
    await client.query('BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY')
    const boats = await client.query('SELECT id::text, name, capacity FROM boats ORDER BY id LIMIT 1')
    const boat = boats.rows[0]
    if (!boat) { await client.query('COMMIT'); return { boat: null, days: [], version: 0 } }
    const days = await client.query("SELECT to_char(day,'YYYY-MM-DD') AS date, is_open FROM booking_days WHERE boat_id=$1 AND day >= $2::date AND day < ($2::date + interval '1 month') ORDER BY day", [boat.id, `${query.month}-01`])
    const version = await client.query('SELECT version FROM booking_month_versions WHERE boat_id=$1 AND month=$2', [boat.id, `${query.month}-01`])
    await client.query('COMMIT')
    return { boat, days: days.rows, version: version.rows[0]?.version ?? 0 }
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
})

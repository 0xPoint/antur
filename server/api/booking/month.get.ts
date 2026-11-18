import { getMonthAvailability } from '../../database/booking/availability'
import { bookingPool } from '../../utils/booking-db'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event)
  if (String(config.bookingEnabled) !== 'true' || !config.bookingDatabaseUrl) throw createError({ statusCode: 503, statusMessage: 'Booking not configured' })
  const query = getQuery(event)
  if (typeof query.month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(query.month)) throw createError({ statusCode: 400, statusMessage: 'Invalid month' })
  const [year, month] = query.month.split('-').map(Number)
  if (year! < 2026 || year! > 2100) throw createError({ statusCode: 400, statusMessage: 'Invalid month' })
  setHeader(event, 'Cache-Control', 'no-store')
  return { days: await getMonthAvailability(bookingPool(config.bookingDatabaseUrl), year!, month!) }
})

import { performManagerOperation } from '../../database/booking/manager-operations'
import { requireManager, requireManagerOrigin } from '../../utils/manager-auth'
import { bookingPool } from '../../utils/booking-db'
import { readManagerBody } from '../../utils/manager-body'

const conflictErrors = new Set(['STALE_TRIP','TRIP_CANCELLED','TRIP_UNAVAILABLE','ROUTE_REQUIRED','INCOMPATIBLE_FORMAT','NOT_ENOUGH_SEATS','TRIP_OVERLAP','BOOKING_UNAVAILABLE','ACTIVE_CHECKOUT','PAYMENT_REVIEW_REQUIRED','REFUND_PROVIDER_UNAVAILABLE'])
export default defineEventHandler(async event => {
  requireManagerOrigin(event)
  const actor = await requireManager(event)
  const body = await readManagerBody(event)
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  try { return await performManagerOperation(bookingPool(useRuntimeConfig(event).bookingDatabaseUrl), actor, body) }
  catch (error) {
    const code = error instanceof Error ? error.message : ''
    if (code === 'INVALID_INPUT') throw createError({ statusCode: 400, statusMessage: code })
    if (code === 'NOT_FOUND') throw createError({ statusCode: 404, statusMessage: code })
    if (conflictErrors.has(code)) throw createError({ statusCode: 409, statusMessage: code })
    throw error
  }
})

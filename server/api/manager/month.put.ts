import { saveMonth } from '../../database/booking/schedule'
import { requireManager, requireManagerOrigin } from '../../utils/manager-auth'
import { bookingPool } from '../../utils/booking-db'
import { readManagerBody } from '../../utils/manager-body'

export default defineEventHandler(async event => {
  requireManagerOrigin(event)
  const actor = await requireManager(event)
  const body = await readManagerBody(event)
  if (!Number.isSafeInteger(body?.boatId) || !Number.isSafeInteger(body?.version) || body.version < 0 || !Number.isInteger(body?.year) || body.year < 2026 || body.year > 2100 || !Number.isInteger(body?.month) || body.month < 1 || body.month > 12 || !Array.isArray(body?.openDays) || body.openDays.length > 31 || body.openDays.some((day: unknown) => !Number.isInteger(day) || (day as number) < 1 || (day as number) > new Date(Date.UTC(body.year, body.month, 0)).getUTCDate()) || new Set(body.openDays).size !== body.openDays.length) throw createError({ statusCode: 400, statusMessage: 'Invalid month' })
  try { await saveMonth(bookingPool(useRuntimeConfig(event).bookingDatabaseUrl), body.boatId, body.year, body.month, body.openDays, actor, body.version) }
  catch (error) { if (error instanceof Error && error.message === 'MONTH_CONFLICT') throw createError({ statusCode: 409, statusMessage: 'Month changed elsewhere' }); throw error }
  return { ok: true, version: body.version + 1 }
})

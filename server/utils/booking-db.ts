import pg from 'pg'

let connection: { url: string, pool: pg.Pool } | undefined

export function bookingPool(url: string) {
  if (!url) throw createError({ statusCode: 503, statusMessage: 'Booking database unavailable' })
  if (connection && connection.url !== url) throw createError({ statusCode: 503, statusMessage: 'Booking database configuration changed' })
  connection ||= { url, pool: new pg.Pool({ connectionString: url, max: 5 }) }
  return connection.pool
}
